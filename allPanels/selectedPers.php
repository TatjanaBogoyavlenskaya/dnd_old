    <!-- Верхняя панелька (выбор персонажа) -->
    <div class = "selectPers">
        <div>Персонаж
            <select name="namePerses" id = "namePerses" onchange="OnChangedPers(this.value);" class = "namePerses"></select>
            <input type="button" value="Создать нового" onclick="ClearForm();" class = "newPers"><br>
        </div>
    </div>