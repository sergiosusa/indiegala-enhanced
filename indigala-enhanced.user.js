// ==UserScript==
// @name         Indiegala Enhanced
// @namespace    https://sergiosusa.com
// @version      0.2
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

        let navigationContainer = document.querySelector("section.profile-private-page-library-cont");
        let revealSection = document.createElement("div");
        revealSection.style="margin: 0px 10px 15px 10px;display: flex;justify-content:center;"

        revealSection.innerHTML='<div style="display:flex;justify-content:space-evenly;width: 280px;">' +
        '<div><button id="revealBtn" style="text-align: center;line-height: 26px;color: #000000;border: 1px solid #939393;border-radius: 28px;width: 85px;">Reveal</button></div>' +
        '<div><span style="margin-right: 5px;vertical-align: -webkit-baseline-middle"> and copy to </span>' +
        '<input style="vertical-align: -webkit-baseline-middle;" type="radio" id="copy1" name="copy" value="list" />' +
        '<label style="margin-left: 5px;vertical-align: -webkit-baseline-middle;" for="copy1">list</label>' +
        '<input style="margin-left: 5px;vertical-align: -webkit-baseline-middle;" type="radio" id="copy2" name="copy" value="excel" />' +
        '<label style="margin-left: 5px;vertical-align: -webkit-baseline-middle;" for="copy2">excel</label></div>' +
        '</div>';
        
        navigationContainer.parentElement.insertBefore(revealSection, navigationContainer);
        document.querySelector("#revealBtn").onclick = this.revealAndSomething;
    }

    this.revealAndSomething = () => {
        let optionSelected = document.querySelector("input[name='copy']:checked");

        if (null === optionSelected){
            this.reveal().then(this.revealSuccess);

        } else if ("list" === optionSelected.value){
            this.revealAndCopy();
        } else if ("excel" === optionSelected.value){
            this.revealAndCopyToExcel();
        }
    };

    this.revealAndCopy = () => {
        this.reveal().then(this.copy);
    };

    this.revealAndCopyToExcel = () => {
        this.reveal().then(this.copyToExcel);
    };

    this.reveal = () => {
        return new Promise((resolve) => {
            document.querySelector("section.profile-private-page-library-cont").style.opacity = "0.2";
            let revealIntervalId = setInterval(() => {
                let revealButtonsPendding = document.querySelectorAll(".profile-private-page-library-serial-dialog .profile-private-page-library-get-serial-btn");
                if (revealButtonsPendding.length === 0) {
                    clearInterval(revealIntervalId);
                    resolve();
                    document.querySelector("section.profile-private-page-library-cont").style.opacity = "1";
                    return;
                }
                revealButtonsPendding[0].click();
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

    this.revealSuccess = () => {
        alert("Seriales revelados");
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