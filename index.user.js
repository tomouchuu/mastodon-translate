// ==UserScript==
// @name         MastodonTranslate
// @namespace    https://uchuu.io/
// @version      1.3.0
// @description  Aims to provide a translate interface into Mastodon instances
// @author       tomo@uchuu.io
// @match        *://*/web/*
// @match        *://*/settings/preferences
// @connect      translate.uchuu.io
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function getTranslation(status, language, text) {
        text = encodeURIComponent(text);
        GM_xmlhttpRequest({
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            url: "https://translate.uchuu.io/"+language+'/'+text,
            onload: function(res) {
                var resJson = JSON.parse(res.responseText);
                var translatedText = resJson.text;

                var translateArea = document.createElement('p');
                translateArea.classList.add('toot__translation');
                translateArea.innerHTML = '<i style="font-style: italic;">Translated:</i> '+translatedText;

                status.querySelector('div.status__content').appendChild(translateArea);
            },
            onerror: function() {
                console.log('There was an error');
            }
        });
    }

    function addTranslateLink(status) {
        var statusText = status.querySelector('div.status__content').textContent;
        var dropdown = status.querySelector('div.dropdown__content.dropdown__right ul');

        var separator = dropdown.querySelector('li.dropdown__sep');

        var listItem = document.createElement('li');
        listItem.classList.add('translate__toot');

        var link = document.createElement('a');
        // link.setAttribute('href', 'https://translate.google.com/#auto/en/'+statusText);
        link.setAttribute('href', '#');
        link.setAttribute('target', '_blank');
        link.textContent = 'Translate Toot';
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (status.querySelectorAll('p.toot__translation').length === 0) {
                getTranslation(status, GM_getValue('lang', 'en'), statusText);
            }
        }, false);

        listItem.appendChild(link);        
        dropdown.insertBefore(listItem, separator);
    }

    function saveSettings(event) {
        if (event.target.tagName.toLowerCase() === 'button' && event.target.textContent === 'Save changes') {
            event.preventDefault();
            var input = document.getElementById('translation_locale');
            var selectedLanguage = input.options[input.selectedIndex].value;
            GM_setValue('lang', selectedLanguage);

            setTimeout(function() {
                document.querySelector('body').removeEventListener('click', saveSettings, false);
                actions.children[0].click();
            }, 500);
        }
    }

    document.querySelector('body').addEventListener('click', function(event) {
        if (event.target.tagName.toLowerCase() === 'i' && event.target.classList.contains('fa-ellipsis-h')) {
            // Get the status for this event
            var status = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
            var hasTranslateAlready = status.querySelectorAll('div.dropdown__content.dropdown__right ul li.translate__toot');
            if (hasTranslateAlready.length === 0) {
                addTranslateLink(status);
            }
        }
    }, false);

    if (window.location.pathname === '/settings/preferences') {
        // We're on the settings page
        var form = document.querySelector('form.simple_form');
        var actions = document.querySelector('div.actions');

        var settingsGroup = form.querySelector('div.fields-group').cloneNode(true);
        settingsGroup.children[1].remove(); // Remove the privacy element from the clone

        var languageDiv = settingsGroup.children[0];
        languageDiv.classList.remove('user_locale');
        languageDiv.classList.add('translation_locale');
        var label = languageDiv.children[0].children[0];
        label.setAttribute('for', 'translation_locale');
        label.textContent = 'Translation Language';
        var input = languageDiv.children[0].children[1];
        input.setAttribute('name', 'user[translation]');
        input.setAttribute('id', 'translation_locale');
        input.value = GM_getValue('lang', 'en');

        form.insertBefore(settingsGroup, actions);

        document.querySelector('body').addEventListener('click', saveSettings, false);
    }
})();