// pricing.js - Luxury SUV Transportation Pricing Logic

class PricingCalculator {
    constructor() {
        // Base pricing structure
        this.basePrices = {
            hourly: {
                luxurySUV: {
                    baseRate: 125, // per hour
                    minimumHours: 2,
                    chauffeurFee: 50
                },
                premiumSUV: {
                    baseRate: 175,
                    minimumHours: 2,
                    chauffeurFee: 50
                },
                executiveVan: {
                    baseRate: 225,
                    minimumHours: 3,
                    chauffeurFee: 75
                }
            },
            
            pointToPoint: {
                baseFee: 75,
                perMile: 4.50,
                minimumDistance: 15, // miles
                airportPickupFee: 35,
                afterHoursFee: 75, // 10pm-6am
                weekendFee: 50, // Fri 5pm-Mon 6am
                holidayFee: 100
            }
        };
        
        // Additional service fees
        this.additionalFees = {
            additionalStop: 25,
            pets: 35,
            childSeat: 15,
            skiRack: 25,
            luggageTrailer: 75,
            wineTour: 100,
            waitTime: 100, // per hour after 15min grace
            cancellation: {
                within24Hours: 50,
                within2Hours: 100,
                noShow: 150
            }
        };
        
        // Vehicle capacities
        this.vehicleCapacities = {
            luxurySUV: {
                maxPassengers: 6,
                maxLuggage: 4,
                description: "Cadillac Escalade/Lincoln Navigator"
            },
            premiumSUV: {
                maxPassengers: 7,
                maxLuggage: 6,
                description: "Mercedes-Benz GLS/BMW X7"
            },
            executiveVan: {
                maxPassengers: 10,
                maxLuggage: 10,
                description: "Mercedes Sprinter Executive Van"
            }
        };
    }
    
    // Calculate point-to-point price
    calculatePointToPoint(distanceMiles, isAirport = false, isAfterHours = false, isWeekend = false, isHoliday = false) {
        let price = this.basePrices.pointToPoint.baseFee;
        
        // Distance calculation
        const effectiveDistance = Math.max(distanceMiles, this.basePrices.pointToPoint.minimumDistance);
        price += effectiveDistance * this.basePrices.pointToPoint.perMile;
        
        // Add fees
        if (isAirport) price += this.basePrices.pointToPoint.airportPickupFee;
        if (isAfterHours) price += this.basePrices.pointToPoint.afterHoursFee;
        if (isWeekend) price += this.basePrices.pointToPoint.weekendFee;
        if (isHoliday) price += this.basePrices.pointToPoint.holidayFee;
        
        return {
            baseFare: price,
            estimatedTotal: price * 1.2, // Includes 20% for tax, tolls, gratuity
            breakdown: {
                baseFee: this.basePrices.pointToPoint.baseFee,
                distanceCharge: effectiveDistance * this.basePrices.pointToPoint.perMile,
                airportFee: isAirport ? this.basePrices.pointToPoint.airportPickupFee : 0,
                afterHoursFee: isAfterHours ? this.basePrices.pointToPoint.afterHoursFee : 0,
                weekendFee: isWeekend ? this.basePrices.pointToPoint.weekendFee : 0,
                holidayFee: isHoliday ? this.basePrices.pointToPoint.holidayFee : 0
            }
        };
    }
    
    // Calculate hourly rental price
    calculateHourlyRental(hours, vehicleType = 'luxurySUV', passengers = 1, includeChauffeur = true) {
        const vehicle = this.basePrices.hourly[vehicleType];
        if (!vehicle) throw new Error('Invalid vehicle type');
        
        const effectiveHours = Math.max(hours, vehicle.minimumHours);
        let price = effectiveHours * vehicle.baseRate;
        
        if (includeChauffeur) {
            price += vehicle.chauffeurFee;
        }
        
        // Add per-person charge beyond included passengers
        const includedPassengers = this.vehicleCapacities[vehicleType].maxPassengers;
        if (passengers > includedPassengers) {
            const extraPassengers = passengers - includedPassengers;
            price += extraPassengers * 25; // $25 per extra passenger
        }
        
        return {
            baseFare: price,
            estimatedTotal: price * 1.2,
            minimumHours: vehicle.minimumHours,
            vehicleType: vehicleType,
            vehicleDescription: this.vehicleCapacities[vehicleType].description,
            breakdown: {
                hourlyRate: vehicle.baseRate * effectiveHours,
                chauffeurFee: includeChauffeur ? vehicle.chauffeurFee : 0,
                extraPassengerFee: passengers > includedPassengers ? (passengers - includedPassengers) * 25 : 0
            }
        };
    }
    
    // Add additional services
    addAdditionalServices(basePrice, services = {}) {
        let totalAdditional = 0;
        const breakdown = {};
        
        if (services.additionalStops && services.additionalStops > 0) {
            const stopsFee = services.additionalStops * this.additionalFees.additionalStop;
            totalAdditional += stopsFee;
            breakdown.additionalStops = stopsFee;
        }
        
        if (services.pets) {
            totalAdditional += this.additionalFees.pets;
            breakdown.pets = this.additionalFees.pets;
        }
        
        if (services.childSeats && services.childSeats > 0) {
            const childSeatFee = services.childSeats * this.additionalFees.childSeat;
            totalAdditional += childSeatFee;
            breakdown.childSeats = childSeatFee;
        }
        
        if (services.skiRack) {
            totalAdditional += this.additionalFees.skiRack;
            breakdown.skiRack = this.additionalFees.skiRack;
        }
        
        if (services.luggageTrailer) {
            totalAdditional += this.additionalFees.luggageTrailer;
            breakdown.luggageTrailer = this.additionalFees.luggageTrailer;
        }
        
        if (services.wineTour) {
            totalAdditional += this.additionalFees.wineTour;
            breakdown.wineTour = this.additionalFees.wineTour;
        }
        
        if (services.waitTimeHours && services.waitTimeHours > 0) {
            const waitFee = services.waitTimeHours * this.additionalFees.waitTime;
            totalAdditional += waitFee;
            breakdown.waitTime = waitFee;
        }
        
        return {
            baseFare: basePrice.baseFare + totalAdditional,
            estimatedTotal: (basePrice.estimatedTotal || basePrice.baseFare * 1.2) + totalAdditional,
            additionalServices: totalAdditional,
            breakdown: {
                ...basePrice.breakdown,
                additionalServices: breakdown
            }
        };
    }
    
    // Calculate cancellation fee
    calculateCancellationFee(bookingAmount, hoursUntilBooking) {
        if (hoursUntilBooking <= 2) {
            return {
                fee: this.additionalFees.cancellation.noShow,
                percentage: Math.min(100, (this.additionalFees.cancellation.noShow / bookingAmount) * 100)
            };
        } else if (hoursUntilBooking <= 24) {
            return {
                fee: this.additionalFees.cancellation.within2Hours,
                percentage: Math.min(50, (this.additionalFees.cancellation.within2Hours / bookingAmount) * 100)
            };
        } else {
            return {
                fee: this.additionalFees.cancellation.within24Hours,
                percentage: Math.min(25, (this.additionalFees.cancellation.within24Hours / bookingAmount) * 100)
            };
        }
    }
    
    // Generate quote ID
    generateQuoteId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `AGTS-${timestamp}-${random}`.toUpperCase();
    }
    
    // Format price for display
    formatPrice(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PricingCalculator;
} else {
    window.PricingCalculator = PricingCalculator;
}
