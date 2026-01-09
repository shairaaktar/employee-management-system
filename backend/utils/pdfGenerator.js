const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

exports.generatePayslipPDF = async (payroll) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const drawText = (text, x, y, size = 12) =>
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });

  drawText("Salary Slip", 250, 360, 18);
  drawText(`Employee: ${payroll.employee.name}`, 50, 320);
  drawText(`Month: ${payroll.month}`, 50, 300);
  drawText(`Base Salary: ${payroll.baseSalary}`, 50, 280);
  drawText(`Bonus: ${payroll.bonus}`, 50, 260);
  drawText(`Deductions: ${payroll.deductions}`, 50, 240);
  drawText(`Final Salary: ${payroll.finalSalary}`, 50, 220);
  drawText(`Status: ${payroll.status}`, 50, 200);
  drawText(`Date: ${new Date().toLocaleDateString()}`, 50, 180);

  const pdfBytes = await pdfDoc.save();
  const dir = path.join(__dirname, "../uploads/payslips");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${payroll.employee.name}_${payroll.month}.pdf`);
  fs.writeFileSync(filePath, pdfBytes);

  return `/uploads/payslips/${payroll.employee.name}_${payroll.month}.pdf`;
};
