import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import randomColor from 'randomcolor';
import * as bcrypt from 'bcrypt';
import { LinkEntity } from '../../links/entities/link.entity';
import { LinkPollEntity } from '../../link-polls/entities/link-poll.entity';

@Entity('users')
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Expose({ name: 'profile_color' })
  @Column({
    name: 'profile_color',
    nullable: true,
    default: randomColor(),
  })
  profileColor: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty()
  @Expose({ name: 'avatar_filename' })
  @Column({ name: 'avatar_filename', nullable: true })
  avatarFilename: string;

  @Exclude()
  @Column({
    type: 'boolean',
    name: 'is_admin',
    default: false,
  })
  isAdmin: boolean;

  @ApiProperty()
  @Exclude()
  @Column({
    name: 'refresh_token',
    nullable: true,
  })
  refreshToken?: string;

  @ApiProperty()
  @Expose({ name: 'created_at' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @Expose({ name: 'updated_at' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => LinkEntity, (link) => link.user, {
    cascade: true,
  })
  links: LinkEntity[];

  @OneToMany(() => LinkPollEntity, (linkPoll) => linkPoll.user)
  linkPoll!: LinkPollEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
