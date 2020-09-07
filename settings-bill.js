module.exports = function SettingsBill() {
    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel;

    let actionList = [];

    function setSettings(settings) {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = settings.warningLevel;
        criticalLevel = settings.criticalLevel;
    }

    function getSettings() {
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }

    function recordAction(action) {
        let cost = 0;
if(!action){
    return;
}
        if (hasReachedCriticalLevel()) {
            return;
        }

        if (action === 'sms') {
            cost = smsCost;
        }
        else if (action === 'call') {
            cost = callCost;
        }
        actionList.push({
            type: action,
            cost,
            timestamp: new Date()


        });
    }

    function actions() {
        return actionList;
    }

    function actionsFor(type) {
        return actionList.filter((action) => action.type === type);
    }

    function getTotal(type) {
        return actionList.reduce((total, action) => {
            let val = action.type === type ? action.cost : 0;
            return total + val;
        }, 0);
    }

    function grandTotal() {
        return getTotal('sms') + getTotal('call');
    }

    function totals() {
        let smsTotal = getTotal('sms')
        let callTotal = getTotal('call')

        return {
            smsTotal : smsTotal.toFixed(2),
            callTotal : callTotal.toFixed(2),
            grandTotal: grandTotal().toFixed(2)
        }
    }

    function hasReachedCriticalLevel() {
        const total = grandTotal();
        const hasReachedCriticalLevel = total && total > criticalLevel;

        return hasReachedCriticalLevel;
    }

    function hasReachedWarningLevel() {
        const total = grandTotal();
        const hasReachedWarningLevel = total
            && total >= warningLevel && total < criticalLevel;

        return hasReachedWarningLevel;
    }

    function color() {
        if (criticalLevel && warningLevel) {
            if (hasReachedWarningLevel()) {
                return "warning"
            } else if (hasReachedCriticalLevel()) {
                return "critical"
            }
        }
        return "";
    }

    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        color,
        grandTotal,
        getTotal,
        hasReachedCriticalLevel,
        //moment
    }
}




