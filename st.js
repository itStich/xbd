(function () {
    'use strict';

    function startMe() {
        var styles = `
            body {
                background-color: #212121;
            }

            body,
            .card__vote {
                color: #dce3f8;
            }

            body.black--style {
                background: #1a1a1a;
            }

            .menu__item.focus,
            .menu__item.traverse,
            .menu__item.hover,
            .settings-folder.focus,
            .settings-param.focus,
            .selectbox-item.focus,
            .selectbox-item.hover,
            .full-person.focus,
            .full-start__button.focus,
            .full-descr__tag.focus,
            .simple-button.focus,
            .iptv-list__item.focus,
            .iptv-menu__list-item.focus,
            .head__action.focus,
            .head__action.hover,
            .player-panel .button.focus,
            .search-source.active {
                background: linear-gradient(to right, #3051d3 1%, #5b77e0 100%);
                color: #fff;
            }

            .settings-folder.focus .settings-folder__icon {
                filter: invert(0.8);
            }

            .settings-param-title > span {
                color: #ffffff;
            }

            .settings__content,
            .settings-input__content,
            .selectbox__content,
            .modal__content {
                background: linear-gradient(135deg, #2a2f4c 1%, #121530 100%);
            }

            .settings-input__links {
                background-color: rgba(48, 81, 211, 0.2);
            }

            .card.focus .card__view::after,
            .card.hover .card__view::after,
            .extensions__item.focus:after,
            .torrent-item.focus::after,
            .extensions__block-add.focus:after {
                border-color: #5b77e0;
            }

            .online-prestige.focus::after,
            .iptv-channel.focus::before,
            .iptv-channel.last--focus::before {
                border-color: #5b77e0 !important;
            }

            .time-line > div,
            .player-panel__position,
            .player-panel__position > div:after {
                background-color: #5b77e0;
            }

            .extensions {
                background: #1a1a1a;
            }

            .extensions__item,
            .extensions__block-add {
                background-color: #2b2b2b;
            }

            .torrent-item__size,
            .torrent-item__exe,
            .torrent-item__viewed,
            .torrent-serial__size {
                background-color: #dce3f8;
                color: #000;
            }

            .torrent-serial {
                background-color: rgba(48, 81, 211, 0.1);
            }

            .torrent-file.focus,
            .torrent-serial.focus {
                background-color: rgba(48, 81, 211, 0.35);
            }

            .iptv-channel {
                background-color: #3b4aa1 !important;
            }
        `;

        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    if (window.appready) startMe();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                startMe();
            }
        });
    }
})();
