import { Expose } from 'class-transformer';
import { LinkEntity } from '../../links/entities/link.entity';
import { UserEntity } from '../../users/entities/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('link_polls')
export class LinkPollEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.linkPoll, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty({
    type: () => LinkEntity,
  })
  @ManyToOne(() => LinkEntity, (link) => link.linkPoll, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'link_id' })
  link: LinkEntity;

  // @ApiProperty()
  // @Expose({ name: 'deleted_at' })
  // @DeleteDateColumn({ name: 'deleted_at' })
  // deletedAt: Date;

  @ApiProperty()
  @Expose({ name: 'created_at' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @Expose({ name: 'updated_at' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
