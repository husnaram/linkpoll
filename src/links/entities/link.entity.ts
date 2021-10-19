import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LinkPollEntity } from '../../link-polls/entities/link-poll.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('links')
export class LinkEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  link: string;

  @ApiProperty()
  @Expose({ name: 'closes_at' })
  @Column({
    name: 'closes_at',
    nullable: true,
  })
  closesAt: string;

  @ApiProperty()
  @Expose({ name: 'created_at' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @Expose({ name: 'updated_at' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.links, {
    nullable: false,
    // eager: true, // User entity related to Link entity loaded automatically
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => LinkPollEntity, (linkPoll) => linkPoll.link, {
    cascade: true,
  })
  linkPoll!: LinkPollEntity[];
}
