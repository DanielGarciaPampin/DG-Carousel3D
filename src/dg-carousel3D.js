$( document ).ready(function() {

	/*$(window).load(function(){
		$("#dg-carousel3D-container").addClass("ready");
	});*/

	var DGCarousel3D = (function() {
		var $carousel_container = $('#dg-carousel3D-container');
		var $carousel = $('#dg-carousel3D'); //TODO if exists
		var numberOfImages = null;
		var numberOfPanels = null;
		var carousel_width = 500;
		var carousel_height = 500;
		var carouselRadius;
		var degreePerPanel;
		var image_width = 250;
		var image_height = 250;
		var columns = 1;
		var rows = 1;
		var visibility = "visible";
		var axis = "horizontal";
		var perspective = 1000;
		var opacity = 1;
		var rotateTimer = null;
		var currentDegree = 0;


		var createPanels = function() {
			numberOfImages = $carousel.find("img").length;
			numberOfPanels = Math.ceil(numberOfImages / (columns*rows));
			var newdiv;
			if (rows == 1 && columns == 2) {
				var counter = 0;
				var x_padding = ((carousel_width - image_width*2) / 4);
				var y_padding = ((carousel_height - image_height) / 2);
				$carousel.children("img").each(function() {
					if ((counter % 2) == 0) {
						newdiv = document.createElement( "figure" );
						$(newdiv).css("width", carousel_width);
						$(newdiv).css("height", carousel_height);
						$carousel.append($(newdiv));
					} 
					$(this).css({'padding-top' : y_padding , 'padding-bottom' : y_padding , 'padding-right' : x_padding , 'padding-left' : x_padding});
					$(this).appendTo($(newdiv));
					counter++;
				});
			} else if (rows == 2 && columns == 1) {
				var counter = 0;
				var x_padding = ((carousel_width - image_width) / 2);
				var y_padding = ((carousel_height - image_height*2) / 4);
				$carousel.children("img").each(function() {
					if ((counter % 2) == 0) {
						newdiv = document.createElement( "figure" );
						$(newdiv).css("width", carousel_width);
						$(newdiv).css("height", carousel_height);
						$carousel.append($(newdiv));
					} 
					$(this).css({'padding-top' : y_padding , 'padding-bottom' : y_padding , 'padding-right' : x_padding , 'padding-left' : x_padding});
					$(this).appendTo($(newdiv));
					counter++;
				});
			} else if (rows == 2 && columns == 2) {
				var counter = 0;
				var x_padding = ((carousel_width - image_width*2) / 4);
				var y_padding = ((carousel_height - image_height*2) / 4);
				$carousel.children("img").each(function() {
					if ((counter % 4) == 0) {
						newdiv = document.createElement( "figure" );
						$(newdiv).css("width", carousel_width);
						$(newdiv).css("height", carousel_height);
						$carousel.append($(newdiv));
					}
					$(this).css({'padding-top' : y_padding , 'padding-bottom' : y_padding , 'padding-right' : x_padding , 'padding-left' : x_padding});
					$(this).appendTo($(newdiv));
					counter++;
				});
			} else {
				var x_padding = ((carousel_width - image_width) / 2);
				var y_padding = ((carousel_height - image_height) / 2);
				$carousel.children("img").each(function() {
					newdiv = document.createElement( "figure" );
					$(newdiv).css("width", carousel_width);
					$(newdiv).css("height", carousel_height);
					$carousel.append($(newdiv));
					$(this).appendTo($(newdiv));
					$(this).css({'padding-top' : y_padding , 'padding-bottom' : y_padding , 'padding-right' : x_padding , 'padding-left' : x_padding});
				});
			}
		}

		var setCarouselWidth = function(new_carousel_width) {
			carousel_width = new_carousel_width;
			$carousel_container.css("width", new_carousel_width);
		}

		var setCarouselHeight = function(new_carousel_height) {
			carousel_height = new_carousel_height;
			$carousel_container.css("height", new_carousel_height);
		}

		var setImageWidth = function(new_image_width) {
			image_width = new_image_width;
			$carousel.children().each(function() {
					$(this).css("width", new_image_width);
				});
		}

		var setImageHeight = function(new_image_height) {
			image_height = new_image_height;
			$carousel.children().each(function() {
					$(this).css("height", new_image_height);
				});
		}

		var setNumberOfColumns = function(new_colums) {
			columns = new_colums;
		}

		var setNumberOfRows = function(new_rows) {
			rows = new_rows;
		}

		var build = function(new_carousel_width, new_carousel_height, new_image_width, new_image_height, new_rows, new_columns) {
			var default_rows = 1;
			var default_columns = 1;

			if (new_columns == 2) {
				if (new_carousel_width <  new_image_width*2) {
					new_image_width = new_carousel_width/2;
					console.log("Image too wide. Image width set to " + new_image_width);
				}
			} else if (new_columns != 1) {
				new_columns = default_columns;
				console.log("Number of columns out of range. Number of columns set to " + default_columns);
			}

			if (new_rows == 2) {
				if (new_carousel_height <  new_image_height*2) {
					new_image_height = new_carousel_height/2;
					console.log("Image too tall. Image height set to " + new_image_height);
				}
			} else if (new_rows != 1) {
				new_rows = default_rows;
				console.log("Number of rows out of range. Number of rows set to " + default_rows);
			}

			setCarouselWidth(new_carousel_width);
			setCarouselHeight(new_carousel_height);
			setImageWidth(new_image_width);
			setImageHeight(new_image_height);
			setNumberOfColumns(new_columns);
			setNumberOfRows(new_rows);
			createPanels();
			drawCarousel();
		}

		var drawCarousel = function() {
			degreePerPanel = (360 / numberOfPanels);
			var degree = 0;

			if(axis == "horizontal") {
				carouselRadius = Math.round( ( carousel_width / 2 ) / Math.tan( Math.PI / numberOfPanels ) );

				$carousel.css({'transform' : 'translateZ(' + -carouselRadius + 'px)'});
				$carousel.children("figure").each(function() {
					$(this).css({'transform' : 'rotateY(' + degree + 'deg) translateZ(' + carouselRadius + 'px)',
						'-ms-transform' : 'rotateY(' + degree + 'deg) translateZ(' + carouselRadius + 'px)',
						'-webkit-transform' : 'rotateY(' + degree + 'deg) translateZ(' + carouselRadius + 'px)'
					});
					degree += degreePerPanel;
				});
			} else {
				carouselRadius = Math.round( ( carousel_height/ 2 ) / Math.tan( Math.PI / numberOfPanels ) );

				$carousel.css({'transform' : 'translateZ(' + -carouselRadius + 'px)'});
				$carousel.children("figure").each(function() {
					$(this).css({'transform' : 'rotateX(' + degree + 'deg) translateZ(' + carouselRadius + 'px)',
						'-ms-transform' : 'rotateX(' + degree + 'deg) translateZ(' + carouselRadius + 'px)',
						'-webkit-transform' : 'rotateX(' + degree + 'deg) translateZ(' + carouselRadius + 'px)'
					});
					degree += degreePerPanel;
				});
			}
		}

		var next = function() {
			var reset = 20000;
			currentDegree += degreePerPanel;
			if (axis == "horizontal") {
				$carousel.css({'transform' : 'translateZ(' + -carouselRadius + 'px) rotateY(' + currentDegree + 'deg)'});
			} else {
				$carousel.css({'transform' : 'translateZ(' + -carouselRadius + 'px) rotateX(' + currentDegree + 'deg)'});
			}	
			if(currentDegree > reset) {
				currentDegree = 0;
			}
		}

		var previous = function() {
			var reset = -20000;
			currentDegree -= degreePerPanel;
			if (axis == "horizontal") {
				$carousel.css({'transform' : 'translateZ(' + -carouselRadius + 'px) rotateY(' + currentDegree + 'deg)'});
			} else {
				$carousel.css({'transform' : 'translateZ(' + -carouselRadius + 'px) rotateX(' + currentDegree + 'deg)'});
			}
			if(currentDegree < reset) {
				currentDegree = 0;
			}
		}

		var setVisibility = function(option) {
			visibility = option;

			if (option == "hidden") {
				$carousel.children("figure").each(function() {
					$(this).css({'-webkit-backface-visibility':'hidden',
						'backface-visibility':'hidden'
					});
				});
			} else {
				$carousel.children("figure").each(function() {
					$(this).css({'-webkit-backface-visibility':'visible',
						'backface-visibility':'visible'
					});
				});
			}
		}
		var setAxis = function(option) {
			axis =  option;
			drawCarousel();
		}

		var setPerspective = function(option) {
			var default_perspective = 1000;
			if(option >= 1) {
				perspective = option
				$carousel_container.css('perspective', option);
			} else {
				perspective = default_perspective;
			}
		}

		var setOpacity = function(option) {
			var default_opacity = 1;
			if(opacity >= 0 && opacity <= 1) {
				opacity = option
				$carousel.children("figure").each(function() {
					$(this).css('opacity',option);
				});
			} else {
				opacity = default_opacity;
			}
		}

		var rotateTimer = function(option1, option2) {
			if (option1 < 1000 ) {
				option1 = 1000;
			}
			clearInterval(rotateTimer);
			if (option2 == "forward") {
				rotateTimer = setInterval(next, option1);
			} else {
				rotateTimer = setInterval(previous, option1);
			}
		}

		var addEffect = function(option, option2) {		
			if (option == 1) {
				var max_rotation = [];
				if(option2[0] >= 0 && option2[0] <= 45) {
					max_rotation[0] = option2[0];
				} else {
					max_rotation[0] = 5;
					console.log("Rotation X value out of range. Max rotation set to " + max_rotation[0]);
				}
				if(option2[1] >= 0 && option2[1] <= 45) {
					max_rotation[1] = option2[1];
				} else {
					max_rotation[1] = 5;
					console.log("Rotation Y value out of range. Max rotation set to " + max_rotation[1]);
				}

				$carousel.find("img").each(function() {
					newdiv = document.createElement( "div" );
					$(newdiv).css('display','inline-block');
					$(this).parent().append($(newdiv));
					$(this).appendTo($(newdiv));

					$(this).mousemove(function(event){
						var mouse_coordinates = [(event.pageX - $(this).offset().left),  (event.pageY - $(this).offset().top)];				
						var imageCenter = [ ($(this).width() / 2) , ($(this).height() / 2)];
						var rotation  = [imageCenter[0] - mouse_coordinates[0] , imageCenter[1] - mouse_coordinates[1]];
						var ratio = [(rotation[0]/imageCenter[0]) , (rotation[1]/imageCenter[1])];
						var rotation = [ratio[0]*max_rotation[0] , ratio[1]*max_rotation[1]];
						$(this).css({'transform' : 'rotateY(' + -rotation[0] + 'deg) rotateX(' + rotation[1] + 'deg) '});
					});

					$(this).mouseout(function(event){
						$(this).css({'transform' : 'none'});
					});
				});
			} else if (option == 2) {
				var max_depth;
				if(option2 > carouselRadius ) {
					max_depth = carouselRadius;
				} else {
					max_depth = option2;
				}
				console.log(max_depth);

				$carousel.find("img").each(function() {
					newdiv = document.createElement( "div" );
					$(newdiv).css('display','inline-block');
					$(this).parent().append($(newdiv));
					$(this).appendTo($(newdiv));
					$(this).css({'transition' : '1s'});

					$(this).mouseover(function(event){
						$(this).css({'transform' : 'translateZ(' + -max_depth + 'px)'});
					});

					$(this).mouseout(function(event){
						$(this).css({'transform' : 'translateZ(' + 0 + 'px)'});
					});
				});
			}
		}

		var setInteraction = function(option) {

		}

		return {
			build: build,
			setVisibility: setVisibility,
			setAxis: setAxis,
			setPerspective: setPerspective,
			setOpacity: setOpacity,
			rotateTimer: rotateTimer,
			addEffect: addEffect,
			setInteraction: setInteraction

		};

	})();

	DGCarousel3D.build(230, 340, 220, 330, 1, 1);
	DGCarousel3D.setVisibility("hidden"); //visible, hidden
	DGCarousel3D.setAxis("horizontal"); //horizontal, vertical
	DGCarousel3D.setPerspective(1000); // 1 - infinite
	DGCarousel3D.setOpacity(1); // 0 - 1
	DGCarousel3D.rotateTimer(1000, "backward"); //0 - infinite
	DGCarousel3D.addEffect(2, -90); // 0 - No effects, 1 - Effect1
	DGCarousel3D.setInteraction(0);
});