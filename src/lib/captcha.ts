export const TOKEN = "6Le4jKMmAAAAAEMYhU8sg6MpBg-ba_TzFHmM02-E"

export const loading = new Promise((resolve) => {
    const script = document.createElement('script') as HTMLScriptElement
    script.onload = resolve
    script.src = `https://www.google.com/recaptcha/api.js?render=${TOKEN}`
    document.head.appendChild(script)
})

export const getToken = async (): Promise<string> => new Promise(async (resolve, reject) => {
    await loading
    grecaptcha.ready(function () {
        grecaptcha.execute(TOKEN, { action: 'submit' }).then((token) => {
            resolve(token)
        });
    });
})