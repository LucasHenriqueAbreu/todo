import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todo')
export class Todo {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    titulo: string;

    @Column()
    descricao: string;

    @Column('int')
    status: Status;

}

export enum Status {
    aberto,
    pronto
}
