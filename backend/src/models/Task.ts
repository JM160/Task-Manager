export interface Task {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    created_at: Date;
    due_date?: Date | null;
    completed_at?: Date | null;
}
