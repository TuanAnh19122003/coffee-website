import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'feedbacks' })
export class Feedback {
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column({ type: "nvarchar", length: 255 })
    firstName?: string;
  
    @Column({ type: "nvarchar", length: 255 })
    lastName?: string;
  
    @Column({ type: "nvarchar", length: 255 })
    email?: string;
  
    @Column({ type: "nvarchar", length: 20 })
    phoneNumber?: string;
  
    @Column({ type: "nvarchar", length: 255 })
    subjectName?: string;
  
    @Column({ length: 500, nullable: true })
    note?: string;
}
