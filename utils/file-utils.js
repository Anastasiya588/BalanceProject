export class FileUtils {
    static loadPageScript(src) {
        //С помощью промиса можно работать последовательно
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve('Script loaded: ' + src);

            script.onerror = () => reject(new Error('Script load error for: ' + src));
            document.body.appendChild(script);
        })
    }
}