/*!
 * LayerCake, a quick-to-use calendar/date picker
 * http://ianli.github.com/layercake/
 * 
 * Copyright 2011 Ian Li, http://ianli.com
 * Licensed under the MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Requires the following Javascript libraries:
 * - [jQuery](http://jquery.com/) for DOM manipulation
 * - [Underscore.js](http://documentcloud.github.com/underscore/) for utility functions
 */

// Adding the semicolon is recommended;
// prevents errors when minifying plugins together.
;(function($, _, undefined) {
  
	var LayerCake = function(selector, opts) {
		// Use `self` to refer to this object to reduce confusion.
		var self = this,
		
		    // Options (cloned from the passed options)
		    options = _.clone((typeof opts === 'undefined') ? {} : opts),
		
		    // The default date used if date is not specified in `opts`
		    defaultDate = new Date();
		    
		// Set defaults for options.
		_.defaults(options, {
			range: "day",
			year: defaultDate.getFullYear(),
			month: defaultDate.getMonth(),
			day: defaultDate.getDate(),
			showRangeSelector: true,
			confirmSelect: false,
			selected: function() {
				// Do nothing when the select button is clicked.
			}
		});
			
		// The different months.
		// Months will be 0-based, like Javascript dates.
		var MONTHS = [
				'J', 'F', 'M', 'A', 'M', 'J',
				'J', 'A', 'S', 'O', 'N', 'D'
				// "Jan", "Feb", "Mar", "Apr", "May", "Jun",
				// "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
			],
			
			// The different ranges that can be selected.
			RANGES = ["year", "month", "week", "day"],
			
			// The main element
			$el = (selector instanceof jQuery) ? selector : $(selector),
			
			// Number of years to show
			viewNumYears = 3,
			
			// The first year to show
			viewStartYear = options.year - viewNumYears + 1;
		
		// Prepare UI.
		// -----------
					
		// Create base HTML.
		$el.html('\
		  <div class="_ranges"></div> \
		  <div class="_yearsrow"> \
			  <div class="_prev">&laquo;</div> \
			  <div class="_years"></div> \
			  <div class="_next">&raquo;</div> \
			  <div style="clear:both;"></div> \
		  </div> \
		  <div class="_months"></div> \
		  <div class="_daynames"> \
  		  <div class="_dayname">Su</div> \
  		  <div class="_dayname">M</div> \
  		  <div class="_dayname">T</div> \
  		  <div class="_dayname">W</div> \
  		  <div class="_dayname">Th</div> \
  		  <div class="_dayname">F</div> \
  		  <div class="_dayname">Sa</div> \
		  </div> \
		  <div class="_days"></div> \
		');
		
		// Add select button.
		if (options.confirmSelect) {
			$('<div class="_select">Select</div>')
				.appendTo($el)
				.click(function() {
					triggerSelect(true);
				});
		}
	
		// Add ranges buttons.
		var $ranges = $el.find("._ranges");
		for (var i = 0, n = RANGES.length; i < n; i++) {
			var r = RANGES[i];
			var capitalized = r.replace(/^./, r[0].toUpperCase());
			$("<div class='_range'>" + capitalized + "</div>")
				.data("range", r)
				.click(function(event) {
					options.range = $(this).data("range");
					triggerSelect();
					update("range");
				})
				.appendTo($ranges);
		}
		
		// Add years buttons.
		var $years = $el.find("._years");
		for (var i = 0; i < viewNumYears; i++) {
			$("<div class='_year'></div>")
				.click(function(event) {
					options.year = $(this).data("year");
					triggerSelect();
					update("year");
				})
				.appendTo($years);
		}
		
		$el.find("._prev").click(function(event) {
			viewStartYear -= 1;
			update("year");
		});
		
		$el.find("._next").click(function(event) {
			viewStartYear += 1;
			update("year");
		});
		
		// Add months buttons.
		var $months = $el.find("._months");
		for (var i = 0; i < 12; i++) {
			var $i = $("<div class='_month'>" + MONTHS[i] + "</div>")
						.data("month", i)
						.click(function(event) {
							options.month = $(this).data("month");
							triggerSelect();
							update("month");
						})
						.appendTo($months);
		}
		
		// Add days buttons.
		var $days = $el.find("._days");
		for (var i = 1; i <= 42; i++) {
			$("<div class='_day'>" + i + "</div>")
				.data("day", i)
				.click(function(event) {
					options.day = $(this).data("day");
					triggerSelect();
					update("day");
				})
				.appendTo($days);
		}
		
		
		// Methods
		// -------
		
		// Gets the property specified by `propertyName`.
		var get = function(propertyName) {
		  if (typeof options[propertyName] === 'undefined') {
		    return null;
		  } else {
		    return options[propertyName];
		  }
		};
		
		// Sets the properties on this calendar.
		var set = function(newOptions) {
		  _.extend(options, newOptions);
		  
		  if (typeof newOptions.year !== 'undefined') {
		    // The first year to show
  			viewStartYear = newOptions.year - viewNumYears + 1;
		  }
		  
			// Update the view.
			update();
		};
		
		var triggerSelect = function(confirm) {
			if (confirm || !options.confirmSelect) {
				options.selected.call(self);
			}
		};
		
		// Updates the whole view.
		// `which` specifies which aspects of the view to update.
		// Options are range, year, month, and day.
		var update = function (which) {
			if (typeof which === 'undefined' || which === "all") {
				which = "range,year,month,day";
			}
			
			if (which.match("range")) {
				// Update the range that is selected.
				$el.find("._range")
					.removeClass("selected")
					.each(function (i, el) {
						if (options.range == $(el).data("range")) {
							$(el).addClass("selected");
						}
					});

				// Hide or show months and days depending on range.
				if (options.range === "year") {
					$el.find("._months").hide();
					$el.find("._daynames").hide();
					$el.find("._days").hide();
				} else if (options.range === "month") {
					$el.find("._months").show();
					$el.find("._daynames").hide();
					$el.find("._days").hide();
				} else {
					$el.find("._months").show();
					$el.find("._daynames").show();
					$el.find("._days").show();
				}
			} 
			
			if (which.match("year")) {
				// Update the view's starting year.
        //if (options.year < viewStartYear || viewStartYear + viewNumYears <= options.year) {
				//	viewStartYear = options.year - viewNumYears + 1;
        //}

				// Update the year that is selected.
				$el.find("._year")
					.removeClass("selected")
					.each(function (i, element) {
						var y = viewStartYear + i,
							$element = $(element);

						$element.html(y).data("year", y);

						if (options.year == $element.data("year")) {
							$element.addClass("selected");
						}
					});
			}
			
			if (which.match("month")) {
				// Update the month that is selected.
				$el.find("._month")
					.removeClass("selected")
					.each(function (i, el) {
						if (options.month == $(el).data("month")) {
							$(el).addClass("selected");
						}
					});
			}
			
			if (which.match("month") || which.match("day")) {
				updateGrid();
				
				// Update the day that is selected.
				$el.find("._day")
					.removeClass("selected")
					.each(function (i, el) {
						if (options.day == $(el).data("day")) {
							$(el).addClass("selected");
						}
					});
			}
			
			// Show/hide the range selector.
  		if (options.showRangeSelector) {
  		  $el.find('._ranges').show();
  		} else {
  		  $el.find('._ranges').hide();
  		}
		};
		
		var updateGrid = function () {
			var yy = options.year,
				mm = options.month;
			
			// First of the month
			var firstDate = new Date(yy, mm, 1);
			// Day of the first of the month
			var firstDayOfWeek = firstDate.getDay();
			// Number of days in the month
			var numDaysInMonth = 28;
			for (var i = 29; i <= 31; i++) {
				if (new Date(yy, mm, i).getMonth() != mm) {
					break;
				}
				numDaysInMonth = i;
			}
			
			// Cycle through each cell in the calendar.
			$el.find("._day").each(function (i, element) {
				var day = (i - firstDayOfWeek) + 1;
				if (day < 1) {
					$(element).show()
						.html("&nbsp;")
						.addClass("empty")
						.data("day", null);
				} else if (day > numDaysInMonth) {
					$(element).hide()
						.data("day", null);
				} else {
					$(element).show()
						.html(day)
						.removeClass("empty")
						.data("day", day);
				}
			});
		}
		
		// Expose the following methods:
		self.update = update;
		self.get = get;
		self.set = set;
		
		// Update the view.
		update();
	};
	
	LayerCake.VERSION = '0.2.0';
	
	window.LayerCake = LayerCake;
})(jQuery, _);