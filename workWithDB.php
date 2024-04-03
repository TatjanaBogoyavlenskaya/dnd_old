<!-- Взаимодействие с БД -->
<?php
    $GLOBALS["hostname"] = "localhost";
    $GLOBALS["username"] = "root";
    $GLOBALS["passwordDB"] = "";
    $GLOBALS["db"] = "dnd";
    $GLOBALS["connect"] = new mysqli($GLOBALS["hostname"],$GLOBALS["username"],$GLOBALS["passwordDB"],$GLOBALS["db"] = "dnd");
    session_start();

    //Отправка запроса на выбор
    function Select($select, $type = null, ...$value)
    {
        $query = $GLOBALS["connect"]->prepare($select);
        if ($type != null):
            $query->bind_param($type, ...$value);
        endif;
        $query->execute();
        return $query->get_result();
    }

    //Отправка запроса на вставку
    function Insert($select, $type = null, ...$value)
    {
        $query = $GLOBALS["connect"]->prepare($select);
        if ($type != null):
            $query->bind_param($type, ...$value);
        endif;
        return $query->execute();
    }

    function Send($insert, $res, $type = null, ...$value)
    {
        $query = $GLOBALS["connect"]->prepare($insert);
        if ($type != null):
            $query->bind_param($type, ...$value);
        endif;
        $result = $query->execute();
        if ($res == true):
            return $result;
        endif;
        return $query->get_result();
    }
?>