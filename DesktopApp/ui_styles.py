class Style():

    style_bt_standard = (
    """
    QPushButton {
        background-image: ICON_REPLACE;
        background-position: left center;
        background-repeat: no-repeat;
        border: none;
        border-left: 15px solid rgb(56, 98, 6);
        background-color: rgb(56, 98, 6);
        text-align: left;
        padding-left: 40px;
        padding-right:10px;
    }
    QPushButton[Active=true] {
        background-image: ICON_REPLACE;
        background-position: left center;
        background-repeat: no-repeat;
        border: none;
        border-left: 10px solid rgb(33, 37, 43);
        background-color: rgb(33, 37, 43);
        text-align: left;
        padding-left: 40px;
    }
    QPushButton:hover {
        background-color: rgb(33, 37, 43);
        border-left: 20px solid rgb(33, 37, 43);
    }
    QPushButton:pressed {
        background-color:  rgb(98, 103, 111);
        border-left: 15px solid  rgb(98, 103, 111);
    }
    """
    )
