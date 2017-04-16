// ==UserScript==
// @name         MastodonTranslate
// @namespace    https://uchuu.io/
// @version      1.0.2
// @description  Aims to provide a translate interface into Mastodon instances
// @author       tomo@uchuu.io
// @match        *://*/web/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addTranslateLink (status) {
        var statusText = status.querySelectorAll('div.status__content p')[0].textContent;
        var dropdown = status.querySelectorAll('div.dropdown__content.dropdown__right ul')[0];

        var separator = dropdown.querySelectorAll('li.dropdown__sep')[0];

        var listItem = document.createElement('li');
        if (listItem.classList) {
            listItem.classList.add('translate__toot');
        } else {
            listItem.className += ' ' + 'translate__toot';
        }
        var link = document.createElement('a');
        link.setAttribute('href', 'https://translate.google.com/#auto/en/'+statusText);
        link.setAttribute('target', '_blank');
        link.textContent = 'Translate Toot';
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
    }, 60000);
})();