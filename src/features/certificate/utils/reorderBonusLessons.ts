import { BonusLesson } from './../../types';

interface ReorderArgs {
    bonusLessons: BonusLesson[]; 
    newBonusLesson: BonusLesson;
    isCreating: boolean;
    id: string;
    videoId: string;
    name: string;
}

export const reorderBonusLessons = ({
    bonusLessons,
    newBonusLesson,
    isCreating,
    id,
    videoId,
    name
}: ReorderArgs) => {
        let bonusLessonsToUpdate = !isCreating
        ? bonusLessons.filter(item => item._id !== id)
        : bonusLessons;

    if (!isCreating) {
        if (newBonusLesson?.sortNumber) {
            bonusLessonsToUpdate?.splice(
                newBonusLesson?.sortNumber - 1,
                0,
                {
                    ...newBonusLesson,
                    name: name,
                    videoId,
                    _id: id
                }
            );
        } else {
            bonusLessonsToUpdate = bonusLessons.map(item => {
                if (item._id === id) {
                    item = { ...item, ...newBonusLesson, videoId };
                }
                return item;
            });
        }
    } else {
        if (newBonusLesson?.sortNumber) {
            bonusLessonsToUpdate?.splice(
                newBonusLesson?.sortNumber - 1,
                0,
                { ...newBonusLesson, videoId }
            );
        } else {
            bonusLessonsToUpdate?.push({ ...newBonusLesson, videoId });
        }
    }
    return bonusLessonsToUpdate
}