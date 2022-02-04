window.onload = initAll;
var xhr = false;
var userNumber = 0;

function initAll() {
    userNumber = parseInt(prompt("What time is it now??", "00:00"));
    showTheTime();
    getJsonData();
}

function showTheTime() {
    var now = new Date();
    document.getElementById("showTime").innerHTML = now.toLocaleString();
    setTimeout(showTheTime, 1000);
}

function getJsonData() {
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {}
        }
    }

    if (xhr) {
        xhr.onreadystatechange = showData;
        xhr.open("GET", "data.txt");
        xhr.responseType = "text";
        xhr.send(null);
    }
    else {
        alert("Sorry, but I couldn't create an XMLHttpRequest.")
    }
    setTimeout(getJsonData, 1000);
}

function showData() {
    const colName = ["name", "exchangeName", "closePriceTime", "closePrice", "bookValue", "P/B Ratio"];
    var tempH2, tempH3, tempTable, tempThead, tempTh, tempTbody, tempTfoot, tempValue, tempTr, tempTd, price, bookValue;
    var RowInex = 0;

    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            const stringData = xhr.response;
            const data = JSON.parse(caesar(stringData, userNumber, "decode").replaceAll("'", '"'));
            const stockData = data["stockData"];
            const updateTime = data["updateTime"];
            
            tempH3 = document.createElement("h3");
            tempH3.innerHTML = "Update Time: " + updateTime;
            document.getElementsByTagName("body")[0].appendChild(tempH3);

            for (var industry in stockData) {
                RowInex = 0;

                tempH2 = document.createElement("h2");
                tempH2.innerHTML = toTitleCase(industry);
                document.getElementsByTagName("body")[0].appendChild(tempH2);

                tempTable = document.createElement("table");
                tempThead = document.createElement("thead");
                tempTr = document.createElement("tr");
                setRowColor(tempTr, RowInex);
                RowInex++;

                for (var i=0; i<colName.length; i++) {
                    tempTh = document.createElement("th");
                    tempTh.innerHTML = colName[i];
                    tempTr.appendChild(tempTh);
                }
                tempThead.appendChild(tempTr);
                tempTable.appendChild(tempThead);
    
                tempTbody = document.createElement("tbody");
                
                for (var area in stockData[industry]) {
                    tempTr = document.createElement("tr");
                    setRowColor(tempTr, RowInex);
                    tempTr.setAttribute("style", "background-color:#DFFFDF");
                    RowInex++;
                    tempTd = document.createElement("td");
                    tempTd.setAttribute("style", "text-align:left");
                    tempTd.setAttribute("colspan", "6");
                    tempTd.innerHTML = area;
                    tempTr.appendChild(tempTd);
                    tempTbody.appendChild(tempTr);
                    
                    for (var symbol in stockData[industry][area]) {
                        tempTr = document.createElement("tr");
                        setRowColor(tempTr, RowInex);
                        RowInex++;
                        for (i=0; i<colName.length; i++) {
                            if (i == colName.length-1) {
                                price = stockData[industry][area][symbol]["closePrice"];
                                bookValue = stockData[industry][area][symbol]["bookValue"];
                                tempValue = parseFloat(price) / parseFloat(bookValue);
                            }
                            else {
                                tempValue = stockData[industry][area][symbol][colName[i]];
                            }

                            tempTd = document.createElement("td");
                            if (i == 0) {
                                tempTd.setAttribute("style", "text-align:left");
                            }
                            else if (i > 2) {
                                tempValue = tempValue.toFixed(2);
                                tempTd.setAttribute("style", "text-align:right");
                            }
                            
                            
                            tempTd.innerHTML = tempValue;
                            tempTr.appendChild(tempTd);
                        }
                        tempTbody.appendChild(tempTr);
                    }
                    
                }
                tempTable.appendChild(tempTbody);

                tempTfoot = document.createElement("tfoot");
                tempTr = document.createElement("tr");
                tempTd = document.createElement("td");
                tempTd.setAttribute("style", "text-align:left");
                tempTd.setAttribute("colspan", "6");
                tempTd.innerHTML = "Source: Yahoo Finance";
                tempTr.appendChild(tempTd);
                tempTfoot.appendChild(tempTr);
                tempTable.appendChild(tempTfoot);
                
                tempTable.setAttribute("align", "center");
                tempTable.setAttribute("cellpadding", "5px");
                document.getElementsByTagName("body")[0].appendChild(tempTable);
                var tempBr = document.createElement("br");
                document.getElementsByTagName("body")[0].appendChild(tempBr);

            }
            

            
        }
    }
    
}

/**
 * @param {string} start_text
 * @param {number} shift_amount
 * @param {string} cipher_direction
 */
function caesar(start_text, shift_amount, cipher_direction) {
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const alphabet_length = alphabet.length;
    var end_text = "";
    shift_amount = shift_amount % alphabet_length;

    if (cipher_direction == "decode") {
        shift_amount *= -1;
    }
    for (var i=0; i<start_text.length; i++) {
        if (alphabet.indexOf(start_text[i]) > -1) {
            var position = alphabet.indexOf(start_text[i]);
            var new_position = position + shift_amount;
            new_position = new_position % alphabet_length;
            end_text += alphabet[new_position];
        }
        else {
            end_text += start_text[i];
        }
    }
    return end_text;
}
    

function setRowColor(thisRow, index) {
    if (index % 2 == 0 && index > 0) {
        thisRow.setAttribute("style", "background-color:#ECECFF");
    }
}

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}
