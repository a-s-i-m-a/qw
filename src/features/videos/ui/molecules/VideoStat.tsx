import { observer } from "mobx-react-lite";

export const VideoStat = observer(() => {
    return (
        <ul className="flex text-14 text-gray-text font-semibold mb-30p">
            <li className="mr-50p">Просмотры видео: 546</li>
            <li>Прохождение квиза: 126</li>
        </ul>
    );
});
