// ==UserScript==
// @name         MastodonTranslate-EO
// @namespace    https://niu.moe/@tomo
// @version      1.6.1
// @description  Provides a translate toot option into Esperanto only for Mastodon users via GoogleTranslate. By installing this script you agree for the script to use Google Translate.
// @author       tomo@uchuu.io / https://niu.moe/@tomo
// @match        *://*/web/*
// @match        *://*/settings/preferences
// @connect      translate.uchuu.io
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Set Defaults for hardcoding
    var lang = 'eo';

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
                status.querySelector('li.translate__toot a').textContent = 'Translate Toot';
                if (status.querySelector('div.dropdown.dropdown--active') !== null) {
                    status.querySelector('i.fa.fa-ellipsis-h').click();
                }
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
                link.textContent = 'Loading...';
                getTranslation(status, lang, statusText);
            }
        }, false);

        listItem.appendChild(link);
        dropdown.insertBefore(listItem, separator);
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

    // Below not needed as can't change the hardcoded instance
    // function saveSettings(event) {
    //     if (event.target.tagName.toLowerCase() === 'button' && event.target.textContent === 'Save changes') {
    //         event.preventDefault();
    //         var toggle = document.getElementById('user_translation_enabled');
    //         var selectedToggle = toggle.checked;
    //         localStorage.setItem('toggle', selectedToggle);

    //         var input = document.getElementById('translation_locale');
    //         var selectedLanguage = input.options[input.selectedIndex].value;
    //         localStorage.setItem('lang', selectedLanguage);

    //         setTimeout(function() {
    //             document.querySelector('body').removeEventListener('click', saveSettings, false);
    //             actions.children[0].click();
    //         }, 500);
    //     }
    // }

    // if (window.location.pathname === '/settings/preferences') {
    //     // We're on the settings page
    //     var form = document.querySelector('form.simple_form');
    //     var actions = document.querySelector('div.actions');

    //     var settingsGroup = form.querySelector('div.fields-group').cloneNode(true);
    //     settingsGroup.children[1].remove(); // Remove the privacy element from the clone

    //     var notice = document.createElement('div');
    //     var noticeMsg = 'Translation is currently provided by Google Translate, if you\'re not happy with this please don\'t check the checkbox below or just uninstall the script. I\'m looking to offer alternatives to Google which you can track here: <a style="color: #2b90d9" href="https://github.com/tomouchuu/mastodon-translate/issues/6">https://github.com/tomouchuu/mastodon-translate/issues/6</a>';
    //     noticeMsg += '<br>If you have an issue please give me a buzz <a style="color: #2b90d9" href="https://niu.moe/@tomo">@tomo@niu.moe</a> via mastodon or raise an issue on <a style="color: #2b90d9" href="https://github.com/tomouchuu/mastodon-translate/issues">Github</a>';
    //     notice.setAttribute('id', 'translation_notice');
    //     notice.innerHTML = '<h3 style="color: #d9e1e8; font-size: 20px; line-height: 24px; font-weight: 400; margin-bottom: 20px;">Tampermonkey Translation Script</h3><p style="margin-bottom: 20px;">'+noticeMsg+'</p>';

    //     var toggle = document.createElement('div');
    //     toggle.classList.add('input');
    //     toggle.classList.add('boolean');
    //     toggle.classList.add('optional');
    //     toggle.classList.add('user_translation_enabled');
    //     toggle.innerHTML = '<div class="label_input"><input value="0" type="hidden" name="user[translation_enabled]"><label class="boolean optional checkbox" for="user_translation_enabled"><input class="boolean optional" type="checkbox" value="1" name="user[translation_enabled]" id="user_translation_enabled">I\'m happy to use Google Translate</label></div>';
    //     var checkbox = toggle.querySelector('input#user_translation_enabled');
    //     checkbox.checked = (localStorage.getItem('toggle') == 'true');

    //     var languageDiv = settingsGroup.children[0];
    //     languageDiv.classList.remove('user_locale');
    //     languageDiv.classList.add('translation_locale');
    //     var label = languageDiv.children[0].children[0];
    //     label.setAttribute('for', 'translation_locale');
    //     label.textContent = 'Translation Language';
    //     var input = languageDiv.children[0].children[1];
    //     input.setAttribute('name', 'user[translation]');
    //     input.setAttribute('id', 'translation_locale');
    //     input.value = localStorage.getItem('lang');

    //     settingsGroup.insertBefore(notice, languageDiv);
    //     settingsGroup.insertBefore(toggle, languageDiv);

    //     form.insertBefore(settingsGroup, actions);

    //     document.querySelector('body').addEventListener('click', saveSettings, false);
    // }
})();