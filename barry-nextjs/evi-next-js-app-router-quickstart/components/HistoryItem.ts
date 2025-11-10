export default class HistoryItem {
    id!: string;
    user!: string;
    assistant!: string;
    good: boolean = false;
    bad: boolean = false;
    comment: string = "";
}
