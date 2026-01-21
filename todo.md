http://localhost:3000/availability/all-slots?subdomain=luxebeauty&startDate=2026-01-20&endDate=2026-02-20

When the user mounts on the page to select date for availability i want to by default call the endpoint above to show render all the available slots from the beginignog the month to the end. of the month.

The user can also find alost after they have selectd a service using the endpoint below in edge case of single service selecction or multiple service selecetion

GET /availability/slots?subdomain=lolaapril&date=2024-01-20

?serviceIds=id1 (single value)
?serviceIds=id1&serviceIds=id2 (multiple params)
?serviceIds[]=id1&serviceIds[]=id2 (array notation)
?serviceIds[0]=id1&serviceIds[1]=id2 (indexed array notation)