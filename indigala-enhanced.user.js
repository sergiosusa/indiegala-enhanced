// ==UserScript==
// @name         Indiegala Enhanced
// @namespace    https://sergiosusa.com
// @version      0.1
// @description  This script enhanced the famous marketplace Indigala.
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://www.indiegala.com/gift-bundle/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';
    try {

        let indiegala = new Indiegala();
        indiegala.render();
    } catch (exception) {
        alert(exception);
    }
})();

function Indiegala() {
    this.rendererList = [
        new BundleRevealer()
    ];

    this.render = () => {
        let renderer = this.findRenderer();
        renderer.render();
    };

    this.findRenderer = () => {
        return this.rendererList.find(renderer => renderer.canHandleCurrentPage());
    }
}

function Renderer() {
    this.handlePage = "";

    this.canHandleCurrentPage = () => {
        return null !== document.location.href.match(this.handlePage);
    };

    this.showAlert = (text) => {
        alert(text);
    }
}

function BundleRevealer() {
    Renderer.call(this);
    this.handlePage = /https:\/\/www\.indiegala\.com\/gift-bundle\/(.*)/g

    this.render = () => {

        let buttonsContainer = document.querySelector(".profile-private-page-library-menu ul");

        let extraButtons = '<li id="reveal-copy" style="margin-left: 50px;" class="active bg-gradient-red"><div class="profile-private-page-library-menu-item-inner"><a href="javascript:void(0)">( Reveal and Copy )</a></div></li>'
        + '<li id="copy" style="margin-left: 50px;" class="active bg-gradient-red"><div class="profile-private-page-library-menu-item-inner"><a href="javascript:void(0)">( Copy )</a></div></li>'
        + '<li id="copy-excel" style="margin-left: 50px;" class="active bg-gradient-red"><div class="profile-private-page-library-menu-item-inner"><a href="javascript:void(0)">( Copy To Excel )</a></div></li>';

        buttonsContainer.innerHTML = buttonsContainer.innerHTML + extraButtons;

        document.querySelector("#reveal-copy").onclick = this.revealAndCopy;        
        document.querySelector("#copy").onclick = this.copy;        
        document.querySelector("#copy-excel").onclick = this.copyToExcel;        
    }

    this.revealAndCopy = () => {
        this.reveal().then(this.copy);
    };

    this.reveal = () => {
        return new Promise((resolve) => {

            let revealButtons = document.querySelectorAll(".profile-private-page-library-serial-dialog .profile-private-page-library-get-serial-btn");
            let x = 0;

            let revealIntervalId = setInterval(() => {

                if (x === revealButtons.length) {
                    clearInterval(revealIntervalId);
                    resolve();
                    return;
                }
                revealButtons[x].click();
                x++;

            }, 4000);
        });
    }

    this.copy = () => {
        let serials = [];
        let inputSerials = document.querySelectorAll(".profile-private-page-library-key-serial");

        for (let x = 0; x < inputSerials.length; x++) {
            serials.push(inputSerials[x].value);
        }

        GM_setClipboard(serials.join());
        alert("Seriales copiados al portapapeles");
    }

    this.copyToExcel = () => {
        let titles = document.querySelectorAll(".profile-private-page-library-title-row-full");
        let serials = document.querySelectorAll('.profile-private-page-library-key-serial');
        let list = [];

        for(let x = 0; x < titles.length; x++) {
            list.push(titles[x].innerText + '\t' + serials[x].value);
        }

        GM_setClipboard(list.join('\n'));
        alert("Seriales copiados al portapapeles");
    }
}

BundleRevealer.prototype = Object.create(Renderer.prototype);


/***********************************************************
 *  Override Functions
 **********************************************************/

 let confirm = window.confirm;
 unsafeWindow.confirm = function (message, callback, caption) {
     return true;
 };