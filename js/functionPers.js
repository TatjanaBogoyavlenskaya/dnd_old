// Обработчики событий листа перонажа
import {SendServer} from "./workWithServer.js";

//выбор персонажа из подменю
export async function OnChangedPers(value) {
    let id = localStorage.getItem(value);
    document.cookie = "idPers = " + id + "; path = /";
    localStorage.setItem('namePers', value);
    localStorage.setItem('idPers', id);
    location.reload();
}

//Очистка формы для нового персонажа
export function ClearForm() {
    let arrType = ["namePers", "level", "passive_attention", "bonus", "initiative", "class_armor", "speed", "health_max", "health_current", "health_bones",
        "forces", "dexterity", "endurance", "intelligence", "wisdom", "charisma",
        "forcesResult", "dexterityResult", "enduranceResult", "intelligenceResult", "wisdomResult", "charismaResult",
        "forcesSpasbrosok", "dexteritySpasbrosok", "enduranceSpasbrosok", "intelligenceSpasbrosok", "wisdomSpasbrosok", "charismaSpasbrosok",
        "acrobatics", "athletics", "attention", "survival", "training", "intimidation", "execution", "history", "sleight_hand", "magic", "medicine", "deception",
        "nature", "insight", "investigation", "religion", "reserve", "belief", "experience", "health_temporarily", "health_bones_curent"];
    for (let index = 0; index < arrType.length; index++) {
        ClearInput(arrType[index]);
    }
    let arrRadio = ["tests_death_success", "tests_death_failure"];
    for (let index = 0; index < arrRadio.length; index++) {
        for (let setValue = 1; setValue <= 3; setValue++) {
            let radio = document.getElementById(arrRadio[index] + setValue);
            radio.checked = false;
        }
    }
}

//Очистка инпутов
function ClearInput(name) {
    let inputName = document.getElementById(name);
    inputName.value = null;
}

//бросок кубика
export async function OnChangedCube(cube, label = null, nameParametr = null, select = null) {
    let input = localStorage.getItem("namePers");
    let random = Math.floor((Math.random()) * cube);
    while (random === 0) {
        random = Math.floor((Math.random()) * cube);
    }
    let value = random;
    let result = value;
    let text = document.getElementById("textareaChat");
    text.value += input + " => ";
    if (nameParametr != null) {
        let newValue;
        switch (select) {
            case "spasbrosok": {
                let input = document.getElementById(nameParametr + "Spasbrosok");
                newValue = input.value * 1;
                break;
            }
            case "skill":
            case 'initiative': {
                let input = document.getElementById(nameParametr);
                newValue = input.value * 1;
                break;
            }
            default: {
                let input = document.getElementById(nameParametr);
                newValue = Math.floor((input.value - 10) / 2);
                break;
            }
        }

        text.value += label + ": \n\t" + value + " + (" + newValue + ") = ";
        result = value + newValue;
    } else {
        text.value += "d" + cube + " = ";
    }
    text.value += result + "\n";
    text.scrollBy(0, 30);
}

//действия над здоровьем
export async function ChengedHealth(value, label, nameColumn) {
    if (value === 0) return;
    let input = document.getElementById(nameColumn);
    let params = new URLSearchParams();
    params.set("idSelect", "1");
    params.set("idPers", localStorage.getItem('idPers'));
    params.set("nameColumn", nameColumn);
    params.set("value", value);
    const newValue = await SendServer("http://localhost/DND/server/workWithServer.php", params);
    input.value = newValue["value"];
    input = document.getElementById("namePers");
    let text = document.getElementById("textareaChat");
    text.value += input.value + " => " + label + value + " = " + newValue["value"] + "\n";
    text.scrollBy(0, 30);
}

export function KeyDown(e) {
    // console.log(e.code);
    //TODO: сделать проверку нажатой клавишы
}

export  function OpenStock() {
    location.assign("../stock/stockPers.php");
    // Открыть в новой вкладке
}

export function OpenListPers() {
    location.assign("../pers/pers.php");
}

//получение инвентаря
export function GetStock() {
    GetDataMoney();
    GetDataWaight();
}

//получение количества денег
function GetDataMoney() {
    let arrMoney = ["platinum", "gold", "silver", "bronze"];
    for (let index = 0; index < arrMoney.length; index++) {
        SetInput(arrMoney[index]);
    }
}

//вывод веса в инвентаре
function GetDataWaight() {
    let arrWaight = ["curentWeight", "maxWeight"];
    localStorage.setItem('maxWeight', localStorage.getItem("forces") * 10);//TODO: поставить правильную формулу расчета
    for (let index = 0; index < arrWaight.length; index++) {
        SetInput(arrWaight[index]);
    }
}

//вывод описания предмета
async function GetDiscriptionSubject(id) {
    //await CreateSelect(null, nameColumn, null, type, label, "updateSelect", input.value);
}

//Получение денег персонажа
async function GetMoney() {
    let params = new URLSearchParams();
    params.set("idSelect", "7");
    params.set("idPers", localStorage.getItem('idPers'));
    params.set("table", "money");
    const newValue = await SendServer("http://localhost/DND/server/workWithServer.php", params);
    let money = ["platinum", "gold", "silver", "bronze"];
    for (let index = 0; index < money.length; index++) {
        SetInput(money[index], newValue[money[index]]);
    }
}

//получить предметы в инвентаре и то, что одето
async function GetEquipment(isDressed = false) {
    let params = new URLSearchParams();
    params.set("idSelect", "6");
    params.set("idPers", localStorage.getItem('idPers'));
    params.set("isDressed", isDressed);
    await SendServer("http://localhost/DND/server/workWithServer.php", params);
    const newValue = await SendServer("http://localhost/DND/server/workWithServer.php", params);
    SetInput("curentWeight", newValue["curentWeight"]);
    console.log(newValue["select"]);
    let div;
    if (isDressed) {
        div = document.getElementById("equipmentDressed");
    } else {
        div = document.getElementById("stockElement");
    }
    div.innerHTML = newValue["value"];

    if (!isDressed) {
        params.set("idSelect", "5");
        params.set("table", "characteristics");
        let newValue = await SendServer("http://localhost/DND/server/workWithServer.php", params);
        let forces = newValue["forces"];
        let maxWeight = 100 + Math.floor((forces - 10) / 2) * 10;
        SetInput("maxWeight", maxWeight);
    }
}