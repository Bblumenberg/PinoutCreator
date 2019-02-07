$(document).ready(function() {
    var cableHTML = "";
    var cableNameCounter = 1;
    
    $.ajax({
        url: 'cable.html',
        type: 'get',
        async: false,
        success: (html) => {
            cableHTML = html;
        }
    });
    
    function getAddPSUConnectorFunction(section, pins) {
	    return function() {
		    var html = '';
		    var rowPins = pins/2;
		    
		    html += '<div class="connector col-6">' +
			    		'<div class="row connector-row col">';

			for (var i = 0; i < (rowPins-((rowPins % 2 == 0) ? 2 : 1))/2; i++) {
				html += 	'<div class="box transparent"></div>';
			}
			for (var i = 0; i < ((rowPins % 2 == 0) ? 2 : 1); i++) {
				html += 	'<div class="box black"></div>';
			}
			for (var i = 0; i < (rowPins-((rowPins % 2 == 0) ? 2 : 1))/2; i++) {
				html += 	'<div class="box transparent"></div>';
			}
			html += 		'<div class="box transparent delete-connector-button" href="#">ⓧ</div>' +
						'</div>';
					
			for (var i = 0; i < 2; i++) {
				html += '<div class="row connector-row col">';
				for (var j = 0; j < rowPins; j++) {
					html += '<div class="box white"></div>';
				}
				html +=     '<div class="box transparent"></div>' +
						'</div>';
			}
			
			html += '</div>';
			
			section.append(html);
	    };
    }
    
	function addDefinedConnector(section, name) {
		$.ajax({
			url: name + '.html',
			type: 'get',
			success: (html) => {
				section.append(html);
			}
		});
    }
    
    
    $("#add-cable-button").click(function(event) {

        //append a new cable div
        $(this).parent().append(cableHTML);
        
        //move this button to the bottom
        $(this).parent().append(this);
        
        //set the title of the new cable
        var newCable=$(this).parent().find(".cable-div").last();
        newCable.find(".cable-title").val("Cable " + cableNameCounter++);
        
        var psuConnectorsDropdown = newCable.find(".add-psu-connector-dropdown").last().find(".dropdown-menu").last();
        var psuConnectorsSection = newCable.find(".psu-connector-section").last();
        for (var pins of [18, 10, 8, 6]) {
	        psuConnectorsDropdown.append('<a class="add-psu-' + pins + ' dropdown-item" href="#">' + pins + ' Pin</a>')
	        psuConnectorsDropdown.find(".add-psu-" + pins).click(getAddPSUConnectorFunction(psuConnectorsSection, pins));
        }
        newCable.find(".add-psu-con-button")[0].classList.remove("hidden");
    });
    
    $(".container-90").on("click", ".delete-cable-button", function(event) {
	    $(this).closest(".cable-div").remove();
    })

    $(".container-90").on("click", ".delete-connector-button", function(event) {
	    $(this).closest(".connector").remove();
    });
    
    $(".container-90").on("click", ".add-comp-atx-24", function(event) {
	    addDefinedConnector($(this).closest(".cable-div").find(".comp-connector-section").last(), "atx24");
    });
    
    $(".container-90").on("click", ".add-comp-eps-8", function(event) {
	    addDefinedConnector($(this).closest(".cable-div").find(".comp-connector-section").last(), "eps8");
    });
    
    $(".container-90").on("click", ".add-comp-pcie-8", function(event) {
	    addDefinedConnector($(this).closest(".cable-div").find(".comp-connector-section").last(), "pcie8");
    });
    
    $(".container-90").on("click", ".box", function(event) {
	    if (this.classList.contains("black") || this.classList.contains("transparent")) {
		    return;
	    }
	    
	    if (this.classList.contains("selected")) {
		    this.classList.remove("selected");
	    } else {
			var mySection = $(this).closest(".connector-section")[0];
			var iAmComp = mySection.classList.contains("comp-connector-section");
			var otherSection = $(mySection).closest(".cable-div").find(iAmComp ? ".psu-connector-section" : ".comp-connector-section")[0];
			
			if ($(otherSection).find(".selected").length > 0) {
				var otherSelected = $(otherSection).find(".selected")[0];
				otherSelected.classList.remove("selected");
				if (iAmComp) {
					otherSelected.classList.forEach(function(c) {
						if (c != "box") {
							otherSelected.classList.remove(c);
						}
					});
					this.classList.forEach(function(c) {
						if (c != "box" && c != "selected") {
							otherSelected.classList.add(c);
						}
					});
					$(otherSelected).html($(this).html());
				} else {
					var me = this;
					me.classList.forEach(function(c) {
						if (c != "box") {
							me.classList.remove(c);
						}
					});
					otherSelected.classList.forEach(function(c) {
						if (c != "box" && c != "selected") {
							me.classList.add(c);
						}
					});
					$(this).html($(otherSelected).html());
				}
			} else {
				$(this).closest(".connector-section").find(".selected").each(function(index, box) {
			    	box.classList.remove("selected");
				});
				this.classList.add("selected");	
			}
	    }
    });
    
    $("#add-cable-button")[0].classList.remove("hidden");
    $("#add-cable-button")[0].click();
})
