const SHEET_ID =
"16zG10CHmpVuP68hMhm4fNcFuRSTY1HeX";
const GID = {

    daily: "1413316338",

    total: "285814373",

    flights_daily: "1619957913",

    flights_total: "331249514"
};
const names = {
    personnel:"Особовий склад",
    tanks:"Танки",
    bbm:"ББМ",
    artillery:"Артилерія",
    vehicles:"Автомобілі",
    fortifications:"Фортифікації",
    spt:"СпТ",
    antennas:"Антени",  
    tzp:"ТЗП",
    Aircraft: "Літаки",
};

let stats = {
    personnel:{hit:9,destroyed:4},
    tanks:{hit:5,destroyed:2},
    bbm:{hit:6,destroyed:3},
    artillery:{hit:9,destroyed:5},
    vehicles:{hit:5,destroyed:2},
    fortifications:{hit:56,destroyed:21},
    spt:{hit:12,destroyed:4},
    antennas:{hit:5,destroyed:3},
    tzp:{hit:9,destroyed:4},
    Aircraft:{hit:0,destroyed:0}
};

const icons = {
    personnel: "images/os.png",
    tanks: "images/tanks.png",
    bbm: "images/bbm.png",
    artillery: "images/artillery.png",
    antennas: "images/vehicles.png",
    vehicles: "images/truck.png",
    fortifications: "images/fortification.png",
    spt: "images/spt.png",
    tzp: "images/tzp.png",
    Aircraft: "images/aircraft.png"
};
async function getSheet(gid){

    const url =
`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}`;

    const response =
        await fetch(url);

    const text =
        await response.text();

    const json =
        JSON.parse(
            text.substring(47).slice(0,-2)
        );

    return json.table.rows.map(row => {

        const obj = {};

        json.table.cols.forEach((col,i)=>{

            obj[col.label] =
                row.c[i]
                ? row.c[i].v
                : "";

        });

        return obj;
    });
}

function renderStats() {
    const container = document.getElementById("statsContainer");
    container.innerHTML = "";

    for (let key in stats) {
        container.innerHTML += `
            <div class="card">
                <img src="${icons[key]}" class="target-icon" alt="${key}">
                <h3>${key}</h3>
                <div class="value">${stats[key]}</div>
            </div>
        `;
    }
};


let chart;
Chart.register({
    id:"valueLabels",

    afterDatasetsDraw(chart){

        const {ctx} = chart;

        ctx.save();

        chart.data.datasets.forEach((dataset, i)=>{

            const meta =
                chart.getDatasetMeta(i);

            meta.data.forEach((bar, index)=>{

                const value =
                    dataset.data[index];

                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "#000000";

ctx.lineWidth = 4;

ctx.strokeText(
    value,
    bar.x,
    bar.y - 20
);

                ctx.font =
                    "bold 44px Arial";

                ctx.textAlign = "center";
                

                ctx.fillText(
                    value,
                    bar.x ,
                    bar.y - 20
                );
            });
        });
    }
});

function renderCards(){

    const container =
        document.getElementById("statsContainer");

    container.innerHTML="";

    let total=0;

    for(let key in stats){

        total += Number(stats[key].hit);

        container.innerHTML += `
<div class="target-row">

    <div class="target-left">
        <img src="${icons[key]}" class="target-icon" alt="${names[key]}">
        <span class="target-name">${names[key]}</span>
    </div>

    <div class="target-values">

    <div class="hit-value">
        ${stats[key].hit}
    </div>

    <div class="destroyed-value">
        ${stats[key].destroyed}
    </div>

</div>

</div>
`;
    }

    document.getElementById("totalTargets")
        .innerText = total;

    document.getElementById("lastUpdate")
        .innerText =
        "Останнє оновлення: "
        + new Date().toLocaleString("uk-UA");
}

function buildEditor(){

    const editor =
        document.getElementById("editor");

    editor.innerHTML="";

    for(let key in stats){

        editor.innerHTML += `
<div class="input-box">

    <label>${names[key]}</label>

    <input
        type="number"
        id="${key}_hit"
        value="${stats[key].hit}"
        placeholder="Уражено"
    >

    <input
        type="number"
        id="${key}_destroyed"
        value="${stats[key].destroyed}"
        placeholder="Знищено"
    >

</div>
`;
    }
}

function toggleEditor(){

    document
        .getElementById("editor")
        .classList
        .toggle("hidden");
}

function saveStats(){

    for(let key in stats){

        stats[key] = {
    hit:Number(
        document.getElementById(`${key}_hit`).value
    ),

    destroyed:Number(
        document.getElementById(`${key}_destroyed`).value
    )
};
    }

    localStorage.setItem(
        "dshvStats",
        JSON.stringify(stats)
    );

    renderCards();

    updateChart();

    syncChartHeight();

    alert("Статистику збережено");
}

function syncChartHeight() {

    const statsContainer =
        document.getElementById("statsContainer");

    const chartSection =
        document.querySelector(".chart-section");

    if(statsContainer && chartSection){

        if(chart){
            chart.resize();
        }
    }
}

function createChart(){

    const ctx = document.getElementById("statsChart").getContext("2d");

chart = new Chart(ctx,{
    type:"bar",
    data:{
        labels:Object.values(names),
        datasets:[
{
    label:"Уражено",
    data:Object.values(stats).map(item => item.hit),

    backgroundColor:"rgba(1, 34, 84, 0.85)",

    borderColor:"#01398e",

    borderWidth:2,

    borderRadius:8
},
{
    label:"Знищено",
    data:Object.values(stats).map(item => item.destroyed),

    backgroundColor:"rgba(77, 1, 20, 0.85)",

    borderColor:"#800020",

    borderWidth:2,

    borderRadius:8
}
]
    },
    options:{
        responsive:true,

        maintainAspectRatio:false,

        plugins:{
            legend:{
                labels:{
                    color:"#ffffff",
                    font:{
                        size:38,
                        weight:"bold"
                    }
                }
            },

            tooltip:{
                enabled:true
            }
        },

        scales:{

            x:{
                ticks:{
                    color:"#f7f3f3",
                    font:{
                        size:30,
                        weight:"bold"
                    }
                },

                grid:{
                    display:false
                },

                border:{
                    display:false
                }
            },

            y:{
                beginAtZero:true,

                ticks:{
                    display:false
                },

                grid:{
                    display:false
                },

                border:{
                    display:false
                }
            }
        }
    }
});
}

function updateChart(){

    chart.data.datasets[0].data =
        Object.values(stats).map(item => item.hit);

    chart.data.datasets[1].data =
        Object.values(stats).map(item => item.destroyed);

    chart.update();
}

async function loadGoogleSheet(){

    // DAILY

    const daily =
        await getSheet(GID.daily);

    stats = {};

    daily.forEach(row => {

        stats[row.type] = {

            hit:Number(row.hit),

            destroyed:Number(row.destroyed)
        };

    });

    renderCards();

    // TOTAL

    const total =
        await getSheet(GID.daily);

    chart.data.labels =
        total.map(item =>
            names[item.type]
        );

    chart.data.datasets[0].data =
        total.map(item =>
            Number(item.hit)
        );

    chart.data.datasets[1].data =
        total.map(item =>
            Number(item.destroyed)
        );

    chart.update();

    // DAILY FLIGHTS

    const dailyFlights =
        await getSheet(GID.flights_daily);

    document.getElementById(
        "strikeFlights"
    ).innerText =
        dailyFlights[0].strike;

    document.getElementById(
        "reconFlights"
    ).innerText =
        dailyFlights[0].recon;

    // TOTAL FLIGHTS

    const totalFlights =
        await getSheet(GID.flights_total);

    document.getElementById(
        "strikeFlightsTotal"
    ).innerText =
        totalFlights[0].strike;

    document.getElementById(
        "reconFlightsTotal"
    ).innerText =
        totalFlights[0].recon;

    // TOTAL TARGETS

    let totalTargets = 0;

total.forEach(item => {

    totalTargets +=
        Number(item.hit) +
        Number(item.destroyed);

});

document.getElementById(
    "totalTargets"
).innerText = totalTargets;

    // LAST UPDATE

    document.getElementById(
        "lastUpdate"
    ).innerText =
        "Останнє оновлення: " +
        new Date().toLocaleString("uk-UA");
}
createChart();

loadGoogleSheet();

setInterval(() => {

    loadGoogleSheet();

}, 30000);

window.addEventListener("resize", () => {

    syncChartHeight();

});