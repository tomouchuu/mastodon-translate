// ==UserScript==
// @name         MastodonTranslate
// @namespace    https://uchuu.io/
// @version      1.1.0
// @description  Aims to provide a translate interface into Mastodon instances
// @author       tomo@uchuu.io
// @match        *://*/web/*
// @connect      translate.uchuu.io
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    var loopTime = 30000;

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
                translateArea.innerHTML = '<i style="font-style: italic;">Translated:</i> '+translatedText;

                status.querySelectorAll('div.status__content')[0].appendChild(translateArea);
            },
            onerror: function() {
                console.log('There was an error');
            }
        });
    }

    function addTranslateLink(status) {
        // console.log(status.querySelectorAll('div.status__content')[0]);
        var statusText = status.querySelectorAll('div.status__content')[0].textContent;
        var dropdown = status.querySelectorAll('div.dropdown__content.dropdown__right ul')[0];

        var separator = dropdown.querySelectorAll('li.dropdown__sep')[0];

        var listItem = document.createElement('li');
        if (listItem.classList) {
            listItem.classList.add('translate__toot');
        } else {
            listItem.className += ' ' + 'translate__toot';
        }

        var link = document.createElement('a');
        // link.setAttribute('href', 'https://translate.google.com/#auto/en/'+statusText);
        link.setAttribute('href', '#');
        link.setAttribute('target', '_blank');
        link.textContent = 'Translate Toot';
        link.addEventListener('click', function(e) {
            e.preventDefault();
            getTranslation(status, 'en', statusText);
        }, false);

        listItem.appendChild(link);        
        dropdown.insertBefore(listItem, separator);
    }

    var statuses = document.getElementsByClassName('status');
    setInterval(function() {
        for (var i = 0; i < statuses.length; i++) {
            var status = statuses[i];
            var hasTranslateAlready = status.querySelectorAll('div.dropdown__content.dropdown__right ul li.translate__toot');
            if (hasTranslateAlready.length === 0) {
                addTranslateLink(status);
            }
        }
    }, loopTime);
})();