module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].links = [
                    {
                        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&family=Montserrat:wght@600;700&display=swap',
                        rel: 'stylesheet'
                    }
                ];
                return args;
            });
    }
};
