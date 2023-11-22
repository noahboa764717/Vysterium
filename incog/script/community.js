
async function community(app) {
    app.search.title.style.display = 'block';
    app.search.title.textContent = 'Community';
    app.search.input.style.display = 'none';

    const res = await app.bare.fetch("https://cdn.jsdelivr.net/gh/amethystnetwork-dev/.github/meta/discord.json");
    const json = await res.json();
    const code = json.invite_code;
    app.main.support = app.createElement(
        'div', 
        [
            app.createElement('section', [
                app.createElement('p', `You are being taken to the Amethyst Network discord server (discord.gg/${json.invite_code}).`, {
                        style: {
                            'margin-bottom': '0'
                        }
                    }),
                    app.createElement('p', `Are you sure you want to <a href="https://discord.gg/${json.invite_code}">proceed</a>?`, {
                        style: {
                            'margin-bottom': '0'
                        }
                    }),
            ], {
                class: 'data-section'
            }),
            
        ]);
        app.search.back.style.display = 'inline';
    app.search.back.setAttribute(
        'onclick',
        '(' + (function(){
            window.location.hash = '';
        }).toString() + ')();'
    )
};

export { community };
