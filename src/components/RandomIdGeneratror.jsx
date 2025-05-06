const generateNewOrderId = (lastOrderId) => {

    const currentDate = new Date();
    // const currentDate = new Date(dateOfOrder);
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const baseYear = 2024;
    const baseIdLetter = String.fromCharCode(65 + (currentDate.getFullYear() - baseYear));

    const todayDate = `${baseIdLetter}${month}${day}`;

    const [prevDateStr, lastSequenceStr] = lastOrderId.split('_');
    const lastSequence = lastSequenceStr ? parseInt(lastSequenceStr) : 0;
    const lastDate = prevDateStr; 

    const isSameDate = todayDate === lastDate;

    const newSequence = isSameDate ? lastSequence + 1 : 1;

    const newOrderId = `${todayDate}_${String(newSequence).padStart(3, '0')}`;

    return newOrderId;
};

export default generateNewOrderId;