let url = 'countryObesity.csv';
let groups, referenceEntity, referenceData;

d3.csv(url)
	.then(function(dataset) {

		//add a sort dropdown button
		let dropdownButton = d3.select('body')
			.select('.buttonLine')
			.append('select')
			.attr('class','buttons');


		//define sort types
		let options = ['A-Z', 'high-low', 'low-high']

		// add the options to the button
		dropdownButton
			.selectAll('myOptions')
			.data(options)
			.enter()
			.append('option')
			.attr('transform', 'translate(200,0)')
			.text(function(d) {
				return d;
			})
			.attr("value", function(d) {
				return d;
			})

		// //define the information related to play button
		// let moving = false;
		// let buttonData = ['play']
		//
		// //add a play button
		// let playbutton = d3.select('body')
		// 	// .append('g')
		// 	// .attr('class','buttons');
		// 	.select('.buttonLine')
		// 	.attr('class','buttons');
		//
		// //set up play button
		// playbutton
		// 	// .selectAll('.play')
		// 	.data(buttonData)
		// 	.enter()
		// 	.append('button')
		// 	.attr('transform', 'translate(200,0)')
		// 	.attr('type', 'button')
		// 	.attr('name', 'button')
		// 	.attr('value', 'Play')
		// 	.text('Play')
		// 	.on("click", function() {
		// 		var button = d3.select(this);
		// 		if (button.text() == "Pause") {
		// 			// moving = false;
		// 			// clearInterval(timer);
		// 			button.text("Play");
		// 		} else {
		// 			// moving = true;
		// 			// timer = setInterval(step, 100);
		// 			button.text("Pause");
		// 		}
		// 	});

		//add svg
		let svg = d3.select('body').append('svg');
		svg
			.attr("width", "100%")
			.attr("height", "3300px");

		//draw timeline and chart
		drawChart(dataset);

	});

//This function is used to draw the main chart and the reference timeline
function drawChart(dataset) {

	//set up scales for each entity
	let xScale = d3.scaleLinear()
		.domain([0, 10])
		.range([200, window.innerWidth-150]);

	let yScale = d3.scaleLinear()
		.domain([0, 20])
		.range([220, window.innerHeight * 4]);

	let rScale = d3.scaleLinear()
		.domain([0, 65])
		.range([0, 40]);

	//set timeline scale
	let timelineScale = d3.scaleLinear()
		.domain([1975, 2016])
		.range([500, window.innerWidth - 250]);

	//set default reference entity
	let referenceData = dataset.filter(function(d) {
		return d.Entity == 'Global'
	});

	//draw the reference circles
	let timelineCircle = d3.select('svg').append('g')
		.selectAll('g')
		.data(referenceData)
		.enter()

	timelineCircle.append('circle')
		.attr('id', 'referenceCircle')
		.filter(function(d) {
			return d.Year % 5 == 0
		})
		.attr('fill', '#F29F05')
		.attr('cx', function(d, i) {
			return timelineScale(d.Year)
		})
		.attr('cy', function(d, i) {
			return 60
		})
		.attr('r', function(d) {
			return rScale(d.Obesity)
		})

	//draw labels for the obesity rate
	timelineCircle.append('text')
		.attr('id', 'timelineLabel')
		.filter(function(d) {
			return d.Year % 5 == 0
		})
		.attr('x', function(d, i) {
			return timelineScale(d.Year) - 10
		})
		.attr('y', function(d, i) {
			return 10
		})
		.attr('fill', 'grey')
		.attr("font-family", "sans-serif")
		.attr("font-size", "10px")
		.text(function(d) {
			return d.Obesity + '%'
		})

	///main chart///
	//set up groups which contains the circle and labels
	let groups = d3.select('svg')
		.selectAll('g')
		.data(dataset)
		.enter()
		.filter(function(d) {
			return d.Year == 1976
		})
		.append('g')
		.on('mouseenter', function(row) {
			return d3.select(this).select('#obesityRate').transition().attr('opacity', 1).delay(10).duration(200) && d3.select(this).select("circle").transition().attr('fill', '#D93829').delay(10).duration(200);
		}) //display the obesity rate
		.on('mouseleave', function(row) {
			return d3.select(this).select('#obesityRate').transition().attr('opacity', 0).delay(10).duration(200) && d3.select(this).select("circle").transition().attr('fill', '#04B2D9').delay(10).duration(200);
		});

	//add circles for each entity
	groups
		.append('circle')
		.attr('id', 'country')
		.attr('fill', '#04B2D9')
		.attr('cx', function(d, i) {
			return xScale(i % 10)
		})
		.attr('cy', function(d, i) {
			return yScale(Math.floor(i / 10))
		})
		.attr('r', function(d, i) {
			return rScale(d.Obesity)
		})
		.on('click', function(d) {
			referenceData = dataset.filter(function(a) {
				return a.Entity == d.Entity
			});
			d3.selectAll('#referenceCircle')
				.data(referenceData)
				.transition()
				.filter(function(d) {
					return d.Year % 5 == 0
				})
				.attr('r', function(d) {
					return rScale(d.Obesity)
				})
				.delay(100)
				.duration(1000);

			d3.selectAll('#timelineLabel')
				.data(referenceData)
				.transition()
				.filter(function(d) {
					return d.Year % 5 == 0
				})
				.text(function(d) {
					return d.Obesity + '%'
				})
				.delay(100)
				.duration(1000);

			return referenceIndication.text(d.Entity)
			// return referenceEntity == d.Entity
		});



	//add entities' names
	groups
		.append('text')
		.attr('id', 'label')
		.attr("font-family", "sans-serif")
		.attr("font-size", "10px")
		.attr('x', function(d, i) {
			return xScale(i % 10) - 10
		})
		.attr('y', function(d, i) {
			return yScale(Math.floor(i / 10)) + 50
		})
		.text(function(d) {
			return d.Entity
		});


	//add entities' obesity rate
	groups
		.append('text')
		.attr('id', 'obesityRate')
		.attr("font-family", "sans-serif")
		.attr("font-size", "15px")
		.attr('fill', '#D93829')
		.attr('x', function(d, i) {
			return xScale(i % 10) - 10
		})
		.attr('y', function(d, i) {
			return yScale(Math.floor(i / 10)) - 40
		})
		.text(function(d) {
			return d.Obesity + '%'
		})
		.attr('opacity', 0);


	///Slider///
	//display the selected year
	let yearIndication = d3.select('svg')
		.append('text')
		.attr("font-family", "impact")
		.attr("font-size", "80px")
		.attr('x', 200)
		.attr('y', 120)
		.text(1975);

	let yearSelected = 1975;

	//display the reference entity
	let referenceEntity = 'Global';
	let referenceIndication = d3.select('svg')
		.append('text')
		.attr('fill', 'grey')
		.attr("font-family", "sans-serif")
		.attr("font-size", "10px")
		.attr('x', 380)
		.attr('y', 10)
		.text(function(d) {
			return referenceEntity
		});

	//add a slider
	var slider = d3
		.sliderHorizontal()
		.min(1975)
		.max(2016)
		.step(1)
		.default(1975)
		.width(window.innerWidth - 750)
		.displayValue(false)
		.on('onchange', val => {
			yearIndication.text(val);
			yearSelected = val;
			let selectedOption = val;
			let dataFilter = dataset.filter(function(d) {
				return d.Year == selectedOption
			})

			groups.data(dataFilter);
			d3.selectAll('#country')
				.data(dataFilter)
				.transition()
				.attr('r', function(d) {
					return rScale(d.Obesity)
				})
				.duration(500)
				.ease(d3.easeBounce);

			d3.selectAll('#label')
				.data(dataFilter)
				.text(function(d) {
					return d.Entity
				});

			d3.selectAll('#obesityRate')
				.data(dataFilter)
				.text(function(d) {
					return d.Obesity + '%'
				})
		});

	//call slider
	let width = window.innerWidth - 500;
	d3.select('svg').append('g')
		.attr('id', 'slider')
		.attr('width', 100)
		.attr('height', 200)
		.append('g')
		.attr('transform', 'translate(500,100)')
		.call(slider);

	//sort function
	d3.select('select').on('change', function(d) {
		let selectedOption = d3.select(this).property("value");
		let yearFilter = dataset.filter(function(d) {
			return d.Year == yearSelected
		})

		let sortedData;

		//slider works
		if (selectedOption == 'low-high') {
			sortedData = yearFilter.sort(function(a, b) {
				return +a.Obesity - +b.Obesity
			})
		} else if (selectedOption == 'high-low') {
			sortedData = yearFilter.sort(function(a, b) {
				return -a.Obesity - -b.Obesity
			})
		} else {
			sortedData = yearFilter.sort((a, b) => d3.ascending(a.Entity, b.Entity))
		}

		groups.data(sortedData);
		d3.selectAll('#country')
			.data(sortedData)
			.transition()
			.attr('r', function(d) {
				return rScale(d.Obesity)
			})
			.delay(100)
			.duration(1000)
			.ease(d3.easeBounce);

		d3.selectAll('#label')
			.data(sortedData)
			.transition()
			.text(function(d) {
				return d.Entity
			})
			.delay(100)
			.duration(1000);

		d3.selectAll('#obesityRate')
			.data(sortedData)
			.text(function(d) {
				return d.Obesity + '%'
			})

	});

	//exits and removes
	groups
		.exit()
		.remove();

	referenceIndication
		.exit()
		.remove();

	timelineCircle
		.exit()
		.remove();
}
