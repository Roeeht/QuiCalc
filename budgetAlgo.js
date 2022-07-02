var fs = require('fs');
const average = 2;

function CreateLink()
{
    var formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScFghRobG7-wzvAt38Z1NO2vyQxl_W9E9ZALl8j8oCfxUV0mA/viewform?usp=sf_link';
    return formUrl;
}
function SendFilledForm(googleFormCSV )
{
    var pricesAndSuggestions = UserRequestsPrices(googleFormCSV);
    var totalPrices = Calculate(pricesAndSuggestions);
    var suggestions = OfferSuggestions(googleFormCSV);

    console.log(pricesAndSuggestions,totalPrices,suggestions);
}
function OfferSuggestions(filePathForm)
{
    var suggestions = [];
    var delimiter;
    var itemIndex = 0;
    delimiter = '\n';
    var form_line;
    
    //reading the form csv + check if file is empty
    streamForm = fs.readFileSync(filePathForm,{ encoding: 'utf8' });
    streamForm = streamForm.split(delimiter).slice(1).join(delimiter);
    //form_line = streamForm.split(delimiter);
    delimiter = ",";
    form_line = streamForm.split(delimiter);
    form_line = form_line.slice(2);

    form_line.forEach((form_column) => {
                if(form_column == "not interested")
                {
                    suggestions.push(itemIndex);
                }
                itemIndex++;
            })
            return suggestions;
}
function GetAllItems()
{
    var listOfItems  = new Object();
    var streamPrices;
    var delimiter = '\n';
    var prices_lines;
    var index = 0;

    streamPrices = fs.readFileSync(GetDataStore(),{ encoding: 'utf8' });
    var linesExceptFirst = streamPrices.split(delimiter).slice(1).join(delimiter);
    prices_lines = linesExceptFirst.split(delimiter);
    delimiter = ",";
    prices_lines.forEach((price_line)=> {
        listOfItems[index] = price_line.split(delimiter)[0];
        index++;
    })
    return listOfItems;
}
function GetItemPrice(itemIndex,budget)
{
    var itemPrice;
    var streamPrices;
    var prices_lines;
    var delimiter = '\n';

    priceIndex = returnPrices(budget);
    streamPrices = fs.readFileSync(GetDataStore(),{ encoding: 'utf8' });
    var linesExceptFirst = streamPrices.split(delimiter).slice(1).join(delimiter);
    prices_lines = linesExceptFirst.split(delimiter);
    
    delimiter = ",";
    itemPrice = ((prices_lines[itemIndex]).split(delimiter).slice(1))[priceIndex - 1].replace(/\n|\r|\r\n/g,"");
    
    return itemPrice;
}
function GetDataStore()
{
    var filePathPrices ="C:\\workshop\\prices.csv";
    return filePathPrices;
}
function returnPrices(valueRange)
{
    var res;
    
    switch (valueRange)
    {
        case "basic":
            res = 1;
            break;
        case "average":
            res = 2;
            break;
        case "expensive":
            res = 3;
            break;
        default:
            res = 4;
            break;
    }
    return res;
}

function UserRequestsPrices(filePathForm)
{
    var delimiter; 
    var prices  = new Object();
    var itemIndex = 0;
    delimiter = '\n';
    var form_line;
    
    //reading the form csv + check if file is empty
    streamForm = fs.readFileSync(filePathForm,{ encoding: 'utf8' });
    streamForm = streamForm.split(delimiter).slice(1).join(delimiter);
    //form_line = streamForm.split(delimiter);
    delimiter = ",";
    form_line = streamForm.split(delimiter);
    form_line = form_line.slice(2);

    form_line.forEach((form_column) => {
                if(form_column != "not interested")
                {
                    form_column = form_column.replace(/\n|\r|\r\n/g,"");
                    prices[itemIndex] = GetItemPrice(itemIndex,form_column);
                }
                itemIndex++;
            })
            return prices;
}
function Calculate(prices)
{
            var totalPrice = 0;
            
            for( const [Key,value] of Object.entries(prices))
            {
                totalPrice = totalPrice + parseInt(value);
            }
            return totalPrice;
        }
        

module.exports.returnPrices = returnPrices;
module.exports.UserRequestsPrices = UserRequestsPrices;
module.exports.SendFilledForm = SendFilledForm;
module.exports.GetAllItems = GetAllItems;