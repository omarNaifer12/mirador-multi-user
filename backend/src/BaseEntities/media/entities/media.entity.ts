import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumberString, IsString } from 'class-validator';
import { LinkMediaGroup } from '../../../LinkModules/link-media-group/entities/link-media-group.entity';
import { mediaOrigin } from '../../../enum/origins';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ nullable: true })
  url: string;

  @IsString()
  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @IsString()
  @Column()
  hash: string;

  @IsString()
  @Column()
  title: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'enum', enum: mediaOrigin })
  origin: mediaOrigin;

  @IsString()
  @Column()
  description: string;

  @IsNumberString()
  @Column()
  idCreator: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @OneToMany(() => LinkMediaGroup, (linkMediaGroup) => linkMediaGroup.media)
  linkMediaGroup: LinkMediaGroup;
}
