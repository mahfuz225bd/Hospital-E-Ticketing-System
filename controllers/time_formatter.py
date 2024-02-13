def convert_into_12hr_format(time_str):
    # Split the time string into hours, minutes, and seconds
    parts = time_str.split(':')
    if len(parts) < 2 or len(parts) > 3:
        raise ValueError("Invalid time value.")
    
    hours, minutes = map(int, parts[:2])
    seconds = int(parts[2]) if len(parts) == 3 else 0
    
    # Validate the time components
    if not (0 <= hours <= 23 and 0 <= minutes <= 59 and 0 <= seconds <= 59):
        raise ValueError("Invalid time value.")
    
    # Determine if it's AM or PM
    period = 'AM' if hours < 12 else 'PM'
    
    # Convert hours to 12-hour format
    hours = hours % 12
    if hours == 0:
        hours = 12
    
    # Format the time in 12-hour format
    # if len(parts) == 3:
    #     time_12hr = '{:02d}:{:02d}:{:02d} {}'.format(hours, minutes, seconds, period)
    # else:
    #     time_12hr = '{:02d}:{:02d} {}'.format(hours, minutes, period)

    time_12hr = '{:02d}:{:02d} {}'.format(hours, minutes, period)
    
    return time_12hr