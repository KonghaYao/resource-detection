import Persister, { Har } from "@pollyjs/persister";

export const store = new Map<string, number>();

export class InMemoryPersister extends Persister {
    static get id() {
        return "persister";
    }

    /**@ts-ignore */
    onFindRecording(recordingId: string) {
        return false;
    }

    async onSaveRecording(recordingId: string, data: Har) {}

    async onDeleteRecording(recordingId: string) {}
}
