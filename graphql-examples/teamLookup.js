const query1 = `
query GetTeamByNumber($number: Int!, $season: Int!) {
  teamByNumber(number: $number) {
    name
    awards(season : $season){
        type
        placement
    }
    quickStats(season : $season){
        tot{
            value
        }
        auto{
            value
        }
    }
  }
}`;

const query2 = `
query GetTeamByNumber($number: Int!, $season: Int!) {
  teamByNumber(number: $number) {
    name
    number
    awards(season : $season){
        type
        placement
    }
    quickStats(season : $season){
        tot{
            value
        }
        auto{
            value
        }
    }
  }
}`;

const variables = {number: 7797, season : 2023}


fetch("https://api.ftcscout.org/graphql", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({query: query2, variables}),
}).then(r => r.json()).then(d => {console.log(d)
                                console.log(d.data.teamByNumber.name)
                                console.log(d.data.teamByNumber.quickStats.tot.value)
})
