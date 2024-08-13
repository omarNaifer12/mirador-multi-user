import {
  Box,
  CSSObject,
  Divider,
  IconButton,
  List,
  styled,
  Theme,
  Tooltip
} from "@mui/material";
import { Dispatch, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiDrawer from "@mui/material/Drawer";
import WorkIcon from "@mui/icons-material/Work";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import GroupsIcon from "@mui/icons-material/Groups";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { ItemButton } from "./SideBar/ItemButton.tsx";
import { AllProjects } from "../../features/projects/components/AllProjects.tsx";
import { AllGroups } from "../../features/user-group/components/AllGroups.tsx";
import SaveIcon from "@mui/icons-material/Save";
import { updateProject } from "../../features/projects/api/updateProject.ts";
import { CreateProjectDto, Project } from "../../features/projects/types/types.ts";
import IState from "../../features/mirador/interface/IState.ts";
import { MMUModal } from "./modal.tsx";
import { ConfirmDisconnect } from "../../features/auth/components/confirmDisconect.tsx";
import MiradorViewer from "../../features/mirador/Mirador.tsx";
import { getUserAllProjects } from "../../features/projects/api/getUserAllProjects.ts";
import { createProject } from "../../features/projects/api/createProject.ts";
import toast from "react-hot-toast";
import { AllMedias } from "../../features/media/component/AllMedias.tsx";
import { User } from "../../features/auth/types/types.ts";
import { Media } from "../../features/media/types/types.ts";
import { getUserGroupMedias } from "../../features/media/api/getUserGroupMedias.ts";
import { getUserPersonalGroup } from "../../features/projects/api/getUserPersonalGroup.ts";
import { UserGroup } from "../../features/user-group/types/types.ts";

const drawerWidth = 240;
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);
interface ISideDrawerProps{
  user: User,
  handleDisconnect:()=>void
  selectedProjectId?:number
  setSelectedProjectId :(id?:number)=>void
  setViewer: Dispatch<any>
  viewer:any
}

interface MiradorViewerHandle {
  saveProject: () => void;
  setViewer:()=>IState;
}


const CONTENT = {
  PROJECTS:'PROJECT',
  GROUPS:'GROUPS',
  MEDIA:'MEDIA',
}
export const SideDrawer = ({user,handleDisconnect, selectedProjectId,setSelectedProjectId, setViewer, viewer}:ISideDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(CONTENT.PROJECTS)
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [modalDisconectIsOpen, setModalDisconectIsOpen]= useState(false);
  const [miradorState, setMiradorState] = useState<IState | undefined>();
  const [userPersonalGroup, setUserPersonalGroup] = useState<UserGroup>()
  const [medias, setMedias] = useState<Media[]>([])


  const myRef = useRef<MiradorViewerHandle>(null);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleSaveProject = useCallback((newProject:Project)=>{
    return setUserProjects([...userProjects, newProject]);

  },[setUserProjects])

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleChangeContent = (content:string)=>{
    setSelectedProjectId(undefined);
    setSelectedContent(content);
  }

  const HandleSetUserProjects=(userProjects:Project[])=>{
    setUserProjects(userProjects)
  }

  const HandleSetMiradorState =(state:IState | undefined)=>{
    setMiradorState(state)
  }

  const fetchUserPersonalGroup = async()=>{
    const personalGroup = await getUserPersonalGroup(user.id)
    setUserPersonalGroup(personalGroup)
    return personalGroup
  }

  const fetchMediaForUser = async()=>{
    const userPersonalGroup= await fetchUserPersonalGroup()
    const medias = await getUserGroupMedias(userPersonalGroup!.id)
    setMedias(medias);
  }

  const saveMiradorState = useCallback(async () => {
    const miradorViewer = myRef.current?.setViewer();
    if (selectedProjectId) {
      console.log('IF')
      let projectToUpdate:Project = userProjects.find(projectUser => projectUser.id == selectedProjectId)!;
      //TODO FIX THIS BECAUSE PROJECT TO UPDATE SHOULD NOT BE UNDEFINED
      if(projectToUpdate == undefined){
        projectToUpdate= userProjects.find(projectUser => projectUser.id == selectedProjectId)!;
      }
      projectToUpdate.userWorkspace = miradorViewer!;
      if(projectToUpdate){
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { rights, ...projectWithoutRights } = projectToUpdate;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const projectUpdated =await updateProject(projectWithoutRights!)
        console.log(projectUpdated);
        toast.success("Project saved");

      }
    } else {
      console.log('ELSE')
      const project: CreateProjectDto = {
        name: 'new project',
        owner: user,
        userWorkspace: miradorViewer!,
      };
      const r = await createProject(project);
      if (r) {
        setSelectedProjectId(r.id);
        handleSaveProject({
          ...r,
          ...project,
          id: r.id
        });
      }
    }
  }, [handleSaveProject, setSelectedProjectId, user, userProjects]);

  const saveProject = () => {
    saveMiradorState();
  }

  const handleSetDisconnectModalOpen=()=>{
    setModalDisconectIsOpen(!modalDisconectIsOpen);
  }

  const handleDisonnectUser = ()=>{
    handleDisconnect()
    handleSetDisconnectModalOpen()
  }
  const handleSetMiradorState = (state:IState)=>{
    setMiradorState(state)
  }

  const fetchProjects = async () => {
    try {
      console.log('fetchProjects() for : ', user.id );
      const projects = await getUserAllProjects(user.id);
      setUserProjects(projects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };
  //UseEffect is necessary cause in some case selectedProjectId is undefined and made save bug
  useEffect(()=>{
    fetchProjects();
    fetchMediaForUser();
  },[selectedProjectId])

  const projectSelected = useMemo(() => {
    if (userProjects && selectedProjectId){
      const foundProject = userProjects.find(userProject => userProject.id === selectedProjectId);
      return foundProject ? foundProject : null;
    }
    return null;
  }, [userProjects, selectedProjectId]);

  const handleSetMedia = useCallback((newMedia:Media)=>{
    console.log('NEW MEDIA :', newMedia)
    setMedias([...medias, newMedia])
  },[setMedias,medias])

  return(
    <>
      <Drawer variant="permanent" open={open}
      >
        <DrawerHeader>
          <IconButton onClick={open ?  handleDrawerClose : handleDrawerOpen }>
            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{minHeight:'70vh'}}>
          <Tooltip title={"My projects"}><ItemButton selected={CONTENT.PROJECTS=== selectedContent} open={open} icon={<WorkIcon />} text="Projects" action={()=>handleChangeContent(CONTENT.PROJECTS)}/></Tooltip>
          <Tooltip title="My Media"><ItemButton open={open} selected={CONTENT.MEDIA === selectedContent} icon={<SubscriptionsIcon />} text="Media" action={()=>handleChangeContent(CONTENT.MEDIA)}/></Tooltip>
          <Tooltip title=""><ItemButton open={open} selected={CONTENT.GROUPS === selectedContent} icon={<GroupsIcon />} text="Groups" action={()=>handleChangeContent(CONTENT.GROUPS)}/></Tooltip>
          <Tooltip title=""><ItemButton open={open} selected={false} icon={<ConnectWithoutContactIcon />} text="API" action={()=>{console.log('API')}}/></Tooltip>
        </List>
        <Divider/>
        {
          selectedProjectId && (
            <>
              <List>
                <Tooltip title=""><ItemButton open={open} selected={false} icon={<SaveIcon />} text="Save Mirador" action={saveProject}/></Tooltip>
              </List>
              <Divider />
            </>
          )
        }

        <List>
          <ItemButton open={open} selected={false} icon={<SettingsIcon />} text="Settings" action={()=>{console.log('settings')}}/>
          <ItemButton open={open} selected={false} icon={<LogoutIcon />} text="Disconnect" action={handleSetDisconnectModalOpen}/>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {selectedProjectId && projectSelected &&(
          <MiradorViewer
            miradorState={miradorState!}
            setMiradorState={handleSetMiradorState}
            project={projectSelected}
            saveMiradorState={saveMiradorState}
            viewer={viewer}
            setViewer={setViewer}
            ref={myRef}
          />
        )
        }
        {user && user.id && selectedContent === CONTENT.PROJECTS && (
          <AllProjects
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            user={user}
            userProjects={userProjects}
            setUserProjects={HandleSetUserProjects}
            handleSetMiradorState={HandleSetMiradorState}
          />

        )}
        {
          user && user.id && !selectedProjectId &&selectedContent === CONTENT.MEDIA && (
            <AllMedias
              user={user}
              userPersonalGroup={userPersonalGroup!}
              medias={medias}
              handleSetMedia={handleSetMedia}
            />
          )
        }
        {
          user && user.id && selectedContent === CONTENT.GROUPS &&(
            <AllGroups
              user={user}
            />
          )
        }
        {modalDisconectIsOpen &&(
          <MMUModal openModal={modalDisconectIsOpen} setOpenModal={handleSetDisconnectModalOpen} width={400} children={<ConfirmDisconnect handleDisconnect={handleDisonnectUser} />}/>
        )
        }
      </Box>
    </>
  )
}
