import { FC, useContext, useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "../../../../ui/atoms/Icon";
import { ordersStore } from "../../store/OrdersStore";

interface ChangeQtyProps {
    id: string;
    quantity: number;
    name: string;
}

export const ChangeQuantity: FC<ChangeQtyProps> = ({ quantity, id, name }) => {
    const { subQuantity, addQuantity } = useContext(ordersStore);
    const [count, setCount] = useState(0);

    const onMinus = (id: string) => {
        setCount(count - 1);
        subQuantity(id);
    };
    const onPlus = (id: string) => {
        setCount(count + 1);
        addQuantity(id);
    };
    useEffect(() => {
        if (quantity) {
            setCount(quantity);
        } else {
            setCount(0);
        }
    }, [quantity, setCount]);

    const btnClass =
        "h-44p px-15p cursor-pointer flex justify-center items-center";

    return (
        <section className="flex flex-row">
            <button
                type="button"
                className={`${btnClass} ${
                    count <= 0 ? "text-gray-text" : ""
                } focus:outline-none`}
                onClick={() => onMinus(id)}
                disabled={count <= 0}
            >
                <MinusIcon />
            </button>
            <span className="h-44p w-64p border-0 rounded-10p bg-gray-bg flex justify-center items-center text-center">
                {count}
            </span>
            <button
                type="button"
                className={`${btnClass} ${
                    count >= quantity ? "text-gray-text" : ""
                } focus:outline-none`}
                onClick={() => onPlus(id)}
                disabled={count >= quantity}
            >
                <PlusIcon />
            </button>
        </section>
    );
};
