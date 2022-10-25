/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

d3.json('./data/revenues.json')
    .then(data => {
        const margin = { right: 10, left: 100, top: 10, bottom: 150 }

        const width = 600 - (margin.left + margin.right)
        const height = 400 - (margin.top + margin.bottom)

        const svg = d3.select('#chart-area').append('svg')
            .attr('width', width + (margin.left + margin.right))
            .attr('height', height + (margin.top + margin.bottom))

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

        const xScale = d3.scaleBand()
            .domain(data.map(el => el.month))
            .range([0, width])
            .paddingInner(0.2)
            .paddingOuter(0.3)

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.revenue)])
            .range([height, 0])

        g.selectAll('rect')
            .data(data).enter().append('rect').data(data)
            .attr('x', (d) => xScale(d.month))
            .attr('y', (d) => yScale(+d.revenue))
            .attr('width', xScale.bandwidth)
            .attr('height', d => height - yScale(+d.revenue))
            .attr('stroke', 'black')
            .attr('fill', 'grey')


        const yAxisCall = d3.axisLeft(yScale)
            .tickFormat(d => `$${d}`)
        g.append('g')
            .attr('class', 'y axis')
            .call(yAxisCall)

        const xAxisCall = d3.axisBottom(xScale)
        g.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxisCall)
            .selectAll('text')
            .attr('y', '10')
            .attr('x', '0')
            .attr('text-anchor', 'center')

        g.append('text')
            .attr('class', 'x axis-label')
            .attr('x', width / 2)
            .attr('y', height + 70)
            .attr('font-size', '20px')
            .attr('text-anchor', "middle")
            .text("Month")

        g.append('text')
            .attr('class', 'y axis-label')
            .attr('x', - height / 2)
            .attr('y', -60)
            .attr('font-size', '20px')
            .attr('text-anchor', "middle")
            .attr('transform', "rotate(-90)")
            .text("Revenue")
    })
