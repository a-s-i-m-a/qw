import { ComponentType } from "react";

export function retry(
    fn: Function,
    retriesLeft = 5,
    interval = 2500
): Promise<{ default: ComponentType<any> }> {
    return new Promise((resolve, reject) => {
        fn()
            .then(resolve)
            .catch((error: Error) => {
                setTimeout(() => {
                    if (retriesLeft === 1) {
                        // reject('maximum retries exceeded');
                        console.error(error);

                        // reject(error);
                        resolve({
                            default: () => (
                                <div>404 Страница не может быть отображена</div>
                            )
                        });
                        return;
                    }

                    // Passing on "reject" is the important part
                    retry(fn, retriesLeft - 1, interval).then(resolve, reject);
                }, interval);
            });
    });
}
