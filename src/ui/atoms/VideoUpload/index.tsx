import { FC, useRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import cn from "classnames";
import { Upload } from "./Upload";

export interface VideoUploadProps {
    name: string;
    className?: string;
    isEditing: boolean;
}

export const VideoUpload: FC<VideoUploadProps> = ({ name, className, isEditing }) => {
    const context = useFormContext();
    const inputRef = useRef<HTMLInputElement>(null);
    if (!context) {
        throw new Error("Provide FormContext before VideoUpload");
    }
    const { control } = context;
    const {
        field: { value, onChange },
        fieldState: { error }
    } = useController({
        name,
        control
    });

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        onChange(file);
    };

    const onRemove = () => {
        if (inputRef?.current) {
            inputRef.current.value = "";
        }
        onChange(undefined);
    };

    const wrapperClasses = cn(`${value ? "w-full" : "w-175p"}`);

    return (
        <div className={wrapperClasses}>
            <div className="relative upload">
                <Upload 
                    name={name}
                    onRemove={onRemove}
                    className={className}
                    isEditing={isEditing}
                    value={value}
                    error={error}
                />
            </div>
            <input
                onChange={e => onInputChange(e)}
                name={name}
                id={name}
                type="file"
                hidden={true}
                accept="video/*"
                ref={inputRef}
            />
        </div>
    );
};
