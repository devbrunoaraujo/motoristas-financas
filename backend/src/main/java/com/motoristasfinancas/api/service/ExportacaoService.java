package com.motoristasfinancas.api.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.motoristasfinancas.api.model.Despesa;
import com.motoristasfinancas.api.model.RegistroDia;
import com.motoristasfinancas.api.repository.DespesaRepository;
import com.motoristasfinancas.api.repository.RegistroDiaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExportacaoService {

    private final RegistroDiaRepository registroRepository;
    private final DespesaRepository despesaRepository;

    private static final DateTimeFormatter BR_DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // ===== EXCEL =====

    @Transactional(readOnly = true)
    public byte[] exportarExcel(Long usuarioId, int mes, int ano) throws IOException {
        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim = inicio.withDayOfMonth(inicio.lengthOfMonth());

        List<RegistroDia> registros = registroRepository.findByUsuarioIdAndDataBetween(usuarioId, inicio, fim);
        List<Despesa> despesas = despesaRepository.findByUsuarioIdAndDataBetween(usuarioId, inicio, fim);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // Aba Registros
            Sheet regSheet = workbook.createSheet("Registros");
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle moneyStyle = createMoneyStyle(workbook);

            String[] regHeaders = {"Data", "Veículo", "KM Rodado", "Ganho Bruto", "Gasto Combustível", "Lucro Líquido"};
            createHeaderRow(regSheet, regHeaders, headerStyle);

            int rowIdx = 1;
            for (RegistroDia reg : registros) {
                Row row = regSheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(reg.getData().format(BR_DATE));
                row.createCell(1).setCellValue(reg.getVeiculo().getApelido());
                row.createCell(2).setCellValue(reg.getKmRodado().doubleValue());
                row.createCell(3).setCellValue(reg.getGanhoBrutoTotal().doubleValue());
                row.createCell(4).setCellValue(reg.getGastoCombustivelCalculado().doubleValue());
                row.createCell(5).setCellValue(reg.getLucroLiquido().doubleValue());
                for (int i = 3; i <= 5; i++) row.getCell(i).setCellStyle(moneyStyle);
            }

            // Totais
            Row totalRow = regSheet.createRow(rowIdx);
            totalRow.createCell(0).setCellValue("TOTAL");
            totalRow.createCell(3).setCellValue(registros.stream().map(r -> r.getGanhoBrutoTotal()).reduce(BigDecimal.ZERO, BigDecimal::add).doubleValue());
            totalRow.createCell(4).setCellValue(registros.stream().map(r -> r.getGastoCombustivelCalculado()).reduce(BigDecimal.ZERO, BigDecimal::add).doubleValue());
            totalRow.createCell(5).setCellValue(registros.stream().map(r -> r.getLucroLiquido()).reduce(BigDecimal.ZERO, BigDecimal::add).doubleValue());
            for (int i = 3; i <= 5; i++) totalRow.getCell(i).setCellStyle(moneyStyle);

            for (int i = 0; i < regHeaders.length; i++) regSheet.autoSizeColumn(i);

            // Aba Despesas
            Sheet despSheet = workbook.createSheet("Despesas");
            String[] despHeaders = {"Data", "Categoria", "Descrição", "Valor"};
            createHeaderRow(despSheet, despHeaders, headerStyle);

            rowIdx = 1;
            for (Despesa desp : despesas) {
                Row row = despSheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(desp.getData().format(BR_DATE));
                row.createCell(1).setCellValue(desp.getCategoria().name());
                row.createCell(2).setCellValue(desp.getDescricao() != null ? desp.getDescricao() : "");
                row.createCell(3).setCellValue(desp.getValor().doubleValue());
                row.getCell(3).setCellStyle(moneyStyle);
            }

            totalRow = despSheet.createRow(rowIdx);
            totalRow.createCell(0).setCellValue("TOTAL");
            totalRow.createCell(3).setCellValue(despesas.stream().map(Despesa::getValor).reduce(BigDecimal.ZERO, BigDecimal::add).doubleValue());
            totalRow.getCell(3).setCellStyle(moneyStyle);

            for (int i = 0; i < despHeaders.length; i++) despSheet.autoSizeColumn(i);

            workbook.write(out);
            return out.toByteArray();
        }
    }

    // ===== PDF =====

    @Transactional(readOnly = true)
    public byte[] exportarPdf(Long usuarioId, int mes, int ano) throws DocumentException {
        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim = inicio.withDayOfMonth(inicio.lengthOfMonth());

        List<RegistroDia> registros = registroRepository.findByUsuarioIdAndDataBetween(usuarioId, inicio, fim);
        List<Despesa> despesas = despesaRepository.findByUsuarioIdAndDataBetween(usuarioId, inicio, fim);

        BigDecimal totalGanho = registros.stream().map(r -> r.getGanhoBrutoTotal()).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCombustivel = registros.stream().map(r -> r.getGastoCombustivelCalculado()).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalLucro = registros.stream().map(r -> r.getLucroLiquido()).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalDespesas = despesas.stream().map(Despesa::getValor).reduce(BigDecimal.ZERO, BigDecimal::add);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document();
        PdfWriter.getInstance(doc, out);
        doc.open();

        // Título
        com.lowagie.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        com.lowagie.text.Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
        com.lowagie.text.Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
        com.lowagie.text.Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 9);

        doc.add(new Paragraph("Relatório Mensal - " + mes + "/" + ano, titleFont));
        doc.add(new Paragraph(" "));

        // Resumo
        PdfPTable summary = new PdfPTable(4);
        summary.setWidthPercentage(100);
        addSummaryCell(summary, "Ganho Bruto", formatMoney(totalGanho), headerFont, normalFont);
        addSummaryCell(summary, "Combustível", formatMoney(totalCombustivel), headerFont, normalFont);
        addSummaryCell(summary, "Despesas", formatMoney(totalDespesas), headerFont, normalFont);
        addSummaryCell(summary, "Lucro Líquido", formatMoney(totalLucro.subtract(totalDespesas)), headerFont, normalFont);
        doc.add(summary);
        doc.add(new Paragraph(" "));

        // Tabela de Registros
        doc.add(new Paragraph("Registros Diários", headerFont));
        doc.add(new Paragraph(" "));
        PdfPTable regTable = new PdfPTable(6);
        regTable.setWidthPercentage(100);
        regTable.setWidths(new float[]{1.5f, 2f, 1.2f, 1.5f, 1.8f, 1.5f});

        addCell(regTable, "Data", headerFont, true);
        addCell(regTable, "Veículo", headerFont, true);
        addCell(regTable, "KM", headerFont, true);
        addCell(regTable, "Ganho", headerFont, true);
        addCell(regTable, "Combustível", headerFont, true);
        addCell(regTable, "Lucro", headerFont, true);

        for (RegistroDia reg : registros) {
            addCell(regTable, reg.getData().format(BR_DATE), normalFont, false);
            addCell(regTable, reg.getVeiculo().getApelido(), normalFont, false);
            addCell(regTable, reg.getKmRodado().toString(), normalFont, false);
            addCell(regTable, formatMoney(reg.getGanhoBrutoTotal()), normalFont, false);
            addCell(regTable, formatMoney(reg.getGastoCombustivelCalculado()), normalFont, false);
            addCell(regTable, formatMoney(reg.getLucroLiquido()), normalFont, false);
        }
        doc.add(regTable);
        doc.add(new Paragraph(" "));

        // Tabela de Despesas
        if (!despesas.isEmpty()) {
            doc.add(new Paragraph("Despesas", headerFont));
            doc.add(new Paragraph(" "));
            PdfPTable despTable = new PdfPTable(4);
            despTable.setWidthPercentage(100);
            despTable.setWidths(new float[]{1.5f, 2f, 3f, 1.5f});

            addCell(despTable, "Data", headerFont, true);
            addCell(despTable, "Categoria", headerFont, true);
            addCell(despTable, "Descrição", headerFont, true);
            addCell(despTable, "Valor", headerFont, true);

            for (Despesa desp : despesas) {
                addCell(despTable, desp.getData().format(BR_DATE), normalFont, false);
                addCell(despTable, desp.getCategoria().name(), normalFont, false);
                addCell(despTable, desp.getDescricao() != null ? desp.getDescricao() : "", normalFont, false);
                addCell(despTable, formatMoney(desp.getValor()), normalFont, false);
            }
            doc.add(despTable);
        }

        doc.close();
        return out.toByteArray();
    }

    // ===== Helpers =====

    private String formatMoney(BigDecimal value) {
        return "R$ " + value.setScale(2, RoundingMode.HALF_UP).toString();
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        return style;
    }

    private CellStyle createMoneyStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setDataFormat(workbook.createDataFormat().getFormat("#,##0.00"));
        return style;
    }

    private void createHeaderRow(Sheet sheet, String[] headers, CellStyle style) {
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
            headerRow.getCell(i).setCellStyle(style);
        }
    }

    private void addCell(PdfPTable table, String text, com.lowagie.text.Font font, boolean isHeader) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        if (isHeader) {
            cell.setGrayFill(0.85f);
        }
        cell.setPadding(4f);
        table.addCell(cell);
    }

    private void addSummaryCell(PdfPTable table, String label, String value, com.lowagie.text.Font headerFont, com.lowagie.text.Font normalFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, normalFont));
        labelCell.setGrayFill(0.9f);
        labelCell.setPadding(6f);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, headerFont));
        valueCell.setPadding(6f);
        table.addCell(valueCell);
    }
}
