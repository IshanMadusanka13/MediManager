const express = require('express');
const {
    createDischarge, getDischargeByPatientId
} = require('../controllers/dischargeController');

const router = express.Router();

router.post('/', createDischarge);
router.get('/:patientId', getDischargeByPatientId);
router.put('/mark-paid/:id', markDischargeAsPaid);

module.exports = router;
