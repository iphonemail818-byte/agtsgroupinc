// ============================================
// UPDATED PRICING.JS LOGIC - REALISTIC PRICING
// Competitive with Uber Black/Lyft Lux
// ============================================

// REALISTIC pricing configuration for luxury SUV service
const PRICING_CONFIG = {
    // Base pricing (competitive with Uber Black)
    baseFare: 8.00,           // Lower base fare (Uber Black: $8-10)
    perMileRate: 3.25,        // Competitive per mile rate (Uber Black: $3.50-4.00)
    perMinuteRate: 0.50,      // Competitive per minute rate (Uber Black: $0.55-0.65)
    minimumFare: 25.00,       // Minimum fare for short trips
    
    // REALISTIC Surcharges
    passengerSurcharge: {
        1: 0,
        2: 3,
        3: 6,
        4: 9,
        5: 12,
        6: 15
    },
    
    petFee: 10.00,            // Reasonable pet fee
    additionalStopFee: 8.00,  // Reasonable stop fee
    
    // Peak hours (6-9 AM, 4-7 PM weekdays) - 1.15x multiplier
    peakHourMultiplier: 1.15,
    
    // REALISTIC Service fees
    serviceFeePercentage: 8,  // 8% service fee (reasonable)
    bookingFee: 2.50,         // Reasonable booking fee
    
    // Vehicle type multipliers
    vehicleTypes: {
        'standard': 1.0,
        'premium': 1.3,       // 30% premium for luxury SUV
        'executive': 1.5      // 50% premium for executive
    },
    
    // Safety/sanity limits
    maximumPricePerMile: 7.00, // Never charge more than $7 per mile
    maximumFareMultiplier: 2.0  // Never more than 2x the base calculation
};

/**
 * Calculate REALISTIC fare based on trip details
 * Competitive with Uber Black/Lyft Lux pricing
 */
function calculateFare(tripDetails) {
    const defaults = {
        distance: 0,
        duration: 0,
        passengers: 1,
        hasPets: false,
        additionalStops: 0,
        dateTime: new Date(),
        vehicleType: 'premium', // Luxury SUV
        isPeakHour: false
    };
    
    const details = { ...defaults, ...tripDetails };
    
    // Calculate base components
    const distanceCharge = details.distance * PRICING_CONFIG.perMileRate;
    const timeCharge = details.duration * PRICING_CONFIG.perMinuteRate;
    
    // Calculate surcharges
    const passengerSurcharge = PRICING_CONFIG.passengerSurcharge[details.passengers] || 0;
    const petFee = details.hasPets ? PRICING_CONFIG.petFee : 0;
    const stopsFee = details.additionalStops * PRICING_CONFIG.additionalStopFee;
    
    // Calculate initial subtotal
    let subtotal = PRICING_CONFIG.baseFare + 
                  distanceCharge + 
                  timeCharge + 
                  passengerSurcharge + 
                  petFee + 
                  stopsFee;
    
    // Apply peak hour multiplier if applicable
    if (details.isPeakHour) {
        subtotal *= PRICING_CONFIG.peakHourMultiplier;
    }
    
    // Apply vehicle multiplier (luxury SUV = premium)
    const vehicleMultiplier = PRICING_CONFIG.vehicleTypes[details.vehicleType] || 1.0;
    subtotal *= vehicleMultiplier;
    
    // Ensure minimum fare
    subtotal = Math.max(subtotal, PRICING_CONFIG.minimumFare);
    
    // Apply sanity checks
    // 1. Never exceed maximum price per mile
    const pricePerMile = subtotal / (details.distance || 1);
    if (pricePerMile > PRICING_CONFIG.maximumPricePerMile && details.distance > 0) {
        subtotal = PRICING_CONFIG.maximumPricePerMile * details.distance;
    }
    
    // 2. Apply maximum fare multiplier (prevent extreme prices)
    const baseCalculation = PRICING_CONFIG.baseFare + distanceCharge + timeCharge;
    const maximumAllowed = baseCalculation * PRICING_CONFIG.maximumFareMultiplier;
    if (subtotal > maximumAllowed) {
        subtotal = maximumAllowed;
    }
    
    // Calculate service fee and booking fee
    const serviceFee = subtotal * (PRICING_CONFIG.serviceFeePercentage / 100);
    const bookingFee = PRICING_CONFIG.bookingFee;
    
    // Calculate total
    const total = subtotal + serviceFee + bookingFee;
    
    // Return detailed breakdown
    return {
        total: parseFloat(total.toFixed(2)),
        subtotal: parseFloat(subtotal.toFixed(2)),
        breakdown: {
            base: parseFloat(PRICING_CONFIG.baseFare.toFixed(2)),
            distance: parseFloat(distanceCharge.toFixed(2)),
            time: parseFloat(timeCharge.toFixed(2)),
            passengers: parseFloat(passengerSurcharge.toFixed(2)),
            pets: parseFloat(petFee.toFixed(2)),
            stops: parseFloat(stopsFee.toFixed(2)),
            peakHour: details.isPeakHour ? parseFloat((subtotal * (PRICING_CONFIG.peakHourMultiplier - 1)).toFixed(2)) : 0,
            vehicle: parseFloat((subtotal * (vehicleMultiplier - 1)).toFixed(2)),
            serviceFee: parseFloat(serviceFee.toFixed(2)),
            bookingFee: parseFloat(bookingFee.toFixed(2))
        },
        details: {
            distance: parseFloat(details.distance.toFixed(1)),
            duration: parseFloat(details.duration.toFixed(0)),
            passengers: details.passengers,
            hasPets: details.hasPets,
            additionalStops: details.additionalStops,
            isPeakHour: details.isPeakHour,
            vehicleType: details.vehicleType,
            pricePerMile: parseFloat((total / (details.distance || 1)).toFixed(2))
        }
    };
}

/**
 * Get competitive price estimate for a given distance
 * This provides realistic estimates comparable to Uber Black
 */
function getCompetitiveEstimate(distanceMiles, durationMinutes = null, options = {}) {
    const defaults = {
        passengers: 1,
        hasPets: false,
        additionalStops: 0,
        isPeakHour: false
    };
    
    const tripOptions = { ...defaults, ...options };
    
    // If no duration provided, estimate based on distance
    if (!durationMinutes) {
        durationMinutes = distanceMiles * 2.5; // Average 2.5 min per mile
    }
    
    // Calculate using the main fare function
    const fareDetails = calculateFare({
        distance: distanceMiles,
        duration: durationMinutes,
        passengers: tripOptions.passengers,
        hasPets: tripOptions.hasPets,
        additionalStops: tripOptions.additionalStops,
        isPeakHour: tripOptions.isPeakHour
    });
    
    return fareDetails.total;
}

/**
 * Compare price with Uber Black estimate
 * Returns comparison data
 */
function compareWithUberBlack(distanceMiles, durationMinutes = null) {
    // Uber Black typical pricing (varies by city)
    const uberBase = 8.50;
    const uberPerMile = 3.75;
    const uberPerMinute = 0.65;
    const uberBookingFee = 2.80;
    const uberServiceFee = 0.15; // 15%
    
    if (!durationMinutes) {
        durationMinutes = distanceMiles * 2.5;
    }
    
    // Calculate Uber Black estimate
    let uberSubtotal = uberBase + (distanceMiles * uberPerMile) + (durationMinutes * uberPerMinute);
    uberSubtotal = Math.max(uberSubtotal, 25); // Uber minimum
    const uberService = uberSubtotal * uberServiceFee;
    const uberTotal = uberSubtotal + uberService + uberBookingFee;
    
    // Calculate AGTS price
    const agtsPrice = getCompetitiveEstimate(distanceMiles, durationMinutes);
    
    // Return comparison
    return {
        uberBlack: parseFloat(uberTotal.toFixed(2)),
        agtsLuxury: parseFloat(agtsPrice.toFixed(2)),
        savings: parseFloat((uberTotal - agtsPrice).toFixed(2)),
        percentageSavings: parseFloat(((1 - agtsPrice / uberTotal) * 100).toFixed(1))
    };
}
