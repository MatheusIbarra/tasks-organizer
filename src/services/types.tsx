export class Table {
    id!: number;
    title!: string;
    description!: string;
    tasks!: Task[];
}

export class Tag {
    id!: number;
    title!: string;
    description!: string;
    backgroundColor!: string;
}

export class Task {
    id!: string;
    process!: number; //1 - TODO | 2 - DOING | 3 - DONE;
    description!: string;
    title!: string;
    tag?: Tag;
    table!: number;
}