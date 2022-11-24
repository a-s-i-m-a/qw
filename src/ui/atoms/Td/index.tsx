import { FC } from "react";
interface TdProps {}
export const Td: FC<TdProps> = ({ children }) => (
    <td
        className={`inline-flex items-center py-17p px-10p first:pl-5 z-10 whitespace-nowrap text-dark-main text-14 leading-5 text-left relative border-b border-gray-bg overflow-hidden `}
    >
        {children}
    </td>
);
