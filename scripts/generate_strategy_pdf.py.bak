"""
WeCare Home Solutions - Master Strategy Report
Multi-page ReportLab PDF with TOC, structured tables, and proper typography.
"""
import os
import sys
import hashlib
import platform

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, CondPageBreak, Image, ListFlowable, ListItem,
    HRFlowable
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ---------- Font Registration ----------
FONT_DIR = '/usr/share/fonts'
pdfmetrics.registerFont(TTFont('FreeSerif', f'{FONT_DIR}/truetype/freefont/FreeSerif.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Bold', f'{FONT_DIR}/truetype/freefont/FreeSerifBold.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Italic', f'{FONT_DIR}/truetype/freefont/FreeSerifItalic.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-BoldItalic', f'{FONT_DIR}/truetype/freefont/FreeSerifBoldItalic.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', f'{FONT_DIR}/truetype/dejavu/DejaVuSansMono.ttf'))

registerFontFamily('FreeSerif', normal='FreeSerif', bold='FreeSerif-Bold',
                   italic='FreeSerif-Italic', boldItalic='FreeSerif-BoldItalic')
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans')

# Install font fallback for mixed content
sys.path.insert(0, '/home/z/my-project/skills/pdf/scripts')
try:
    from pdf import install_font_fallback
    install_font_fallback()
except Exception as e:
    print(f"Warning: install_font_fallback unavailable: {e}")

# ---------- Cascade Palette ----------
PAGE_BG       = colors.HexColor('#f0f0f1')
SECTION_BG    = colors.HexColor('#eeeff0')
CARD_BG       = colors.HexColor('#e9eced')
TABLE_STRIPE  = colors.HexColor('#eaebec')
HEADER_FILL   = colors.HexColor('#475b66')
COVER_BLOCK   = colors.HexColor('#536e7b')
BORDER        = colors.HexColor('#b2c3cc')
ICON          = colors.HexColor('#416f85')
ACCENT        = colors.HexColor('#2b6886')
ACCENT_2      = colors.HexColor('#b76e4a')
TEXT_PRIMARY  = colors.HexColor('#151617')
TEXT_MUTED    = colors.HexColor('#80878a')
SEM_SUCCESS   = colors.HexColor('#437a55')
SEM_WARNING   = colors.HexColor('#93773d')
SEM_ERROR     = colors.HexColor('#964e47')
SEM_INFO      = colors.HexColor('#4b6c8d')

TABLE_HEADER_COLOR = HEADER_FILL
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = TABLE_STRIPE

# ---------- Styles ----------
styles = getSampleStyleSheet()

H1 = ParagraphStyle('H1', fontName='FreeSerif-Bold', fontSize=18, leading=24,
                    textColor=HEADER_FILL, spaceBefore=18, spaceAfter=12, alignment=TA_LEFT)
H2 = ParagraphStyle('H2', fontName='FreeSerif-Bold', fontSize=14, leading=20,
                    textColor=HEADER_FILL, spaceBefore=14, spaceAfter=8, alignment=TA_LEFT)
H3 = ParagraphStyle('H3', fontName='FreeSerif-Bold', fontSize=11.5, leading=16,
                    textColor=ACCENT, spaceBefore=10, spaceAfter=6, alignment=TA_LEFT)
BODY = ParagraphStyle('Body', fontName='FreeSerif', fontSize=10.5, leading=16,
                      textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=8)
BODY_LEFT = ParagraphStyle('BodyLeft', parent=BODY, alignment=TA_LEFT)
MUTED = ParagraphStyle('Muted', fontName='FreeSerif-Italic', fontSize=9.5, leading=14,
                       textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=4)
BULLET = ParagraphStyle('Bullet', parent=BODY, leftIndent=18, bulletIndent=6, spaceAfter=4, alignment=TA_LEFT)
TABLE_HEADER_STYLE = ParagraphStyle('TH', fontName='FreeSerif-Bold', fontSize=10, leading=14,
                                     textColor=colors.white, alignment=TA_CENTER)
TABLE_CELL_STYLE = ParagraphStyle('TC', fontName='FreeSerif', fontSize=9.5, leading=13,
                                   textColor=TEXT_PRIMARY, alignment=TA_LEFT)
TABLE_CELL_CENTER = ParagraphStyle('TCC', parent=TABLE_CELL_STYLE, alignment=TA_CENTER)
TABLE_CELL_BOLD = ParagraphStyle('TCB', parent=TABLE_CELL_STYLE, fontName='FreeSerif-Bold')
COVER_TITLE = ParagraphStyle('CT', fontName='FreeSerif-Bold', fontSize=32, leading=42,
                              textColor=HEADER_FILL, alignment=TA_LEFT, spaceAfter=18)
COVER_SUBTITLE = ParagraphStyle('CS', fontName='FreeSerif-Italic', fontSize=15, leading=22,
                                textColor=ACCENT, alignment=TA_LEFT, spaceAfter=24)
COVER_META = ParagraphStyle('CM', fontName='FreeSerif', fontSize=11, leading=18,
                             textColor=TEXT_PRIMARY, alignment=TA_LEFT)

TOC_STYLE_0 = ParagraphStyle('TOC0', fontName='FreeSerif-Bold', fontSize=12, leading=18,
                             leftIndent=8, textColor=HEADER_FILL, spaceAfter=4)
TOC_STYLE_1 = ParagraphStyle('TOC1', fontName='FreeSerif', fontSize=10.5, leading=15,
                             leftIndent=24, textColor=TEXT_PRIMARY, spaceAfter=2)

# ---------- TOC DocTemplate ----------
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))

# ---------- Heading helpers ----------
def make_heading(text, style, level=0):
    key = 'h_' + hashlib.md5(text.encode()).hexdigest()[:8]
    p = Paragraph(f'<a name="{key}"/>{text}', style)
    p.bookmark_name = key
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p

def h1(text):
    return make_heading(text, H1, level=0)

def h2(text):
    return make_heading(text, H2, level=1)

def h3(text):
    return make_heading(text, H3, level=2)

def p(text):
    return Paragraph(text, BODY)

def pl(text):
    return Paragraph(text, BODY_LEFT)

def muted(text):
    return Paragraph(text, MUTED)

def bullet_list(items):
    items_p = [Paragraph(it, BULLET) for it in items]
    return ListFlowable([ListItem(it, bulletColor=ACCENT) for it in items_p],
                        bulletType='bullet', start='•', leftIndent=18)

def std_table(data, col_ratios, header=True, hAlign='CENTER'):
    """Build a styled table with proper paragraph cells."""
    page_width = A4[0]
    left_margin = 0.75 * inch
    right_margin = 0.75 * inch
    available = page_width - left_margin - right_margin
    col_widths = [r * available for r in col_ratios]
    # Wrap all cells in Paragraph
    wrapped = []
    for row_idx, row in enumerate(data):
        wrapped_row = []
        for cell in row:
            if isinstance(cell, str):
                if row_idx == 0 and header:
                    wrapped_row.append(Paragraph(f'<b>{cell}</b>', TABLE_HEADER_STYLE))
                else:
                    wrapped_row.append(Paragraph(cell, TABLE_CELL_STYLE))
            else:
                wrapped_row.append(cell)
        wrapped.append(wrapped_row)
    t = Table(wrapped, colWidths=col_widths, hAlign=hAlign, repeatRows=1 if header else 0)
    style_cmds = [
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.4, BORDER),
    ]
    if header:
        style_cmds += [
            ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ]
        # Alternating rows
        for i in range(1, len(data)):
            if i % 2 == 0:
                style_cmds.append(('BACKGROUND', (0, i), (-1, i), TABLE_ROW_ODD))
            else:
                style_cmds.append(('BACKGROUND', (0, i), (-1, i), TABLE_ROW_EVEN))
    t.setStyle(TableStyle(style_cmds))
    return t

def callout_box(title, body_text, color=ACCENT, bg=CARD_BG):
    """Decorative callout box for stats and key insights."""
    title_style = ParagraphStyle('CBT', fontName='FreeSerif-Bold', fontSize=11, leading=16,
                                  textColor=color, alignment=TA_LEFT, spaceAfter=4)
    body_style = ParagraphStyle('CBB', fontName='FreeSerif', fontSize=10, leading=15,
                                textColor=TEXT_PRIMARY, alignment=TA_LEFT)
    inner = [Paragraph(title, title_style), Paragraph(body_text, body_style)]
    t = Table([[inner]], colWidths=[A4[0] - 1.5*inch], hAlign='CENTER')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg),
        ('LINEBEFORE', (0, 0), (0, -1), 3, color),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    return t

def stat_row(stats):
    """Row of stat cards: stats = [(number, label), ...]"""
    cells = []
    for num, label in stats:
        num_style = ParagraphStyle('SN', fontName='FreeSerif-Bold', fontSize=20, leading=24,
                                    textColor=ACCENT, alignment=TA_CENTER)
        lab_style = ParagraphStyle('SL', fontName='FreeSerif', fontSize=9, leading=12,
                                    textColor=TEXT_MUTED, alignment=TA_CENTER)
        cells.append([Paragraph(num, num_style), Paragraph(label, lab_style)])
    col_w = (A4[0] - 1.5*inch) / len(stats)
    t = Table([cells], colWidths=[col_w]*len(stats), hAlign='CENTER')
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 14),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 14),
        ('LINEABOVE', (0, 0), (-1, 0), 2, ACCENT),
        ('LINEBELOW', (0, 0), (-1, -1), 0.5, BORDER),
    ]))
    return t

# ---------- Page Number Footer ----------
def footer_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont('FreeSerif', 9)
    canvas.setFillColor(TEXT_MUTED)
    page_num = canvas.getPageNumber()
    canvas.drawRightString(A4[0] - 0.5*inch, 0.4*inch, f"Page {page_num}")
    canvas.drawString(0.5*inch, 0.4*inch, "WeCare Home Solutions — Website Overhaul Strategy")
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(0.5*inch, 0.55*inch, A4[0] - 0.5*inch, 0.55*inch)
    canvas.restoreState()

# ---------- Build Story ----------
story = []

# ============== COVER PAGE ==============
# Use a centered table to create a professional cover layout
cover_top_spacer = Spacer(1, 120)
cover_title_p = Paragraph("WeCare Home Solutions", ParagraphStyle(
    'CTBig', fontName='FreeSerif-Bold', fontSize=36, leading=44,
    textColor=HEADER_FILL, alignment=TA_LEFT, spaceAfter=8))
cover_subtitle_p = Paragraph("Complete Website Overhaul Strategy", ParagraphStyle(
    'CTSub', fontName='FreeSerif-Bold', fontSize=22, leading=28,
    textColor=ACCENT, alignment=TA_LEFT, spaceAfter=16))
cover_tagline = Paragraph("An SEO-driven multi-page architecture to transform a single-page brochure into a high-converting lead generation platform for the Kashmir appliance repair market.", ParagraphStyle(
    'CTag', fontName='FreeSerif-Italic', fontSize=13, leading=20,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=40))

# Cover meta block
cover_meta_data = [
    [Paragraph('<b>Prepared for</b>', ParagraphStyle('CM1', fontName='FreeSerif-Bold', fontSize=10, leading=14, textColor=TEXT_MUTED, alignment=TA_LEFT)),
     Paragraph('WeCare Home Solutions, Kashmir', ParagraphStyle('CM2', fontName='FreeSerif', fontSize=11, leading=16, textColor=TEXT_PRIMARY, alignment=TA_LEFT))],
    [Paragraph('<b>Prepared by</b>', ParagraphStyle('CM3', fontName='FreeSerif-Bold', fontSize=10, leading=14, textColor=TEXT_MUTED, alignment=TA_LEFT)),
     Paragraph('Digital Strategy & SEO Advisory', ParagraphStyle('CM4', fontName='FreeSerif', fontSize=11, leading=16, textColor=TEXT_PRIMARY, alignment=TA_LEFT))],
    [Paragraph('<b>Date</b>', ParagraphStyle('CM5', fontName='FreeSerif-Bold', fontSize=10, leading=14, textColor=TEXT_MUTED, alignment=TA_LEFT)),
     Paragraph('September 2026', ParagraphStyle('CM6', fontName='FreeSerif', fontSize=11, leading=16, textColor=TEXT_PRIMARY, alignment=TA_LEFT))],
    [Paragraph('<b>Document type</b>', ParagraphStyle('CM7', fontName='FreeSerif-Bold', fontSize=10, leading=14, textColor=TEXT_MUTED, alignment=TA_LEFT)),
     Paragraph('Strategy Report & Implementation Plan', ParagraphStyle('CM8', fontName='FreeSerif', fontSize=11, leading=16, textColor=TEXT_PRIMARY, alignment=TA_LEFT))],
]
cover_meta_t = Table(cover_meta_data, colWidths=[1.4*inch, 4*inch], hAlign='LEFT')
cover_meta_t.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))

cover_accent_bar = HRFlowable(width="100%", thickness=3, color=ACCENT, spaceBefore=20, spaceAfter=20)

story.append(cover_top_spacer)
story.append(cover_title_p)
story.append(cover_subtitle_p)
story.append(cover_accent_bar)
story.append(cover_tagline)
story.append(Spacer(1, 80))
story.append(cover_meta_t)
story.append(Spacer(1, 60))
story.append(HRFlowable(width="40%", thickness=1, color=BORDER, hAlign='LEFT', spaceBefore=10, spaceAfter=10))
story.append(muted("Confidential — for client review and developer handover."))

story.append(PageBreak())

# ============== TABLE OF CONTENTS ==============
story.append(Paragraph('<b>Table of Contents</b>', ParagraphStyle(
    'TOCMain', fontName='FreeSerif-Bold', fontSize=18, leading=24,
    textColor=HEADER_FILL, alignment=TA_LEFT, spaceAfter=18)))
story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT, spaceBefore=0, spaceAfter=18))

toc = TableOfContents()
toc.levelStyles = [TOC_STYLE_0, TOC_STYLE_1]
story.append(toc)
story.append(PageBreak())

# ============== SECTION 1: EXECUTIVE SUMMARY ==============
story.append(h1("Executive Summary"))
story.append(p(
    "WeCare Home Solutions currently operates a single-page brochure website that under-utilizes the company's strong local reputation in the Kashmir appliance repair market. With more than 500 completed repairs, a 4.8-star rating across 9 verified reviews, service coverage in 10+ cities, and expertise across 8+ major appliance brands, the business has the operational credentials to dominate local search — yet the current website is structurally unable to capture this demand. The single-page architecture means every search query — whether for \"washing machine repair in Anantnag\" or \"Samsung refrigerator technician in Srinagar\" — competes for the same thin page, diluting relevance signals and pushing WeCare below competitors who have invested in dedicated service and location pages."
))
story.append(p(
    "This document proposes a complete overhaul of the digital platform, transforming the website from a static brochure into a multi-page, SEO-optimized lead generation engine. The new architecture is built around three pillars: dedicated service pages for each of the six appliance categories, dedicated location pages for each of the eight major Kashmir cities served, and a content engine (blog + FAQs) that captures informational and long-tail commercial search traffic. Each page is engineered with proper heading hierarchy, schema markup (LocalBusiness, FAQ, Service), and conversion-focused calls to action that channel visitors into the booking system or WhatsApp chat."
))
story.append(p(
    "The expected outcome within 6-9 months of launch is a measurable increase in organic search visibility for high-intent local keywords, a doubling of form submissions and WhatsApp inquiries, and the establishment of WeCare Home Solutions as the most discoverable and trusted appliance repair brand in the Kashmir region. The technical specification in this report is developer-ready and includes a recommended technology stack (WordPress + GeneratePress + Rank Math), complete schema markup code, sitemap and robots.txt templates, a multi-step booking form architecture, and a 30-day implementation timeline with a budget estimate in Indian Rupees."
))
story.append(Spacer(1, 14))
story.append(stat_row([
    ("500+", "Repairs completed"),
    ("4.8★", "Average rating (9 reviews)"),
    ("10+", "Cities served"),
    ("8+", "Appliance brands serviced"),
]))
story.append(Spacer(1, 12))
story.append(callout_box(
    "Project Goal in One Sentence",
    "Transform wecarehomesolutions.in from a single-page brochure into a 25+ page, schema-optimized, locally-ranked lead generation platform that captures demand across 6 services and 8 Kashmir cities, supported by a multi-step online booking system and a structured 6-month content roadmap.",
    color=ACCENT, bg=CARD_BG
))

story.append(PageBreak())

# ============== SECTION 2: EXISTING WEBSITE ANALYSIS ==============
story.append(h1("Phase 1.1 — Existing Website Analysis"))
story.append(p(
    "The current WeCare Home Solutions website (https://www.wecarehomesolutions.in/) is a single-page brochure that lists all services, location coverage, and contact information on one URL. While this approach was adequate at launch, it now actively prevents the business from ranking for the spectrum of service-specific and location-specific keywords that potential customers in Kashmir are typing into Google every day. The table below summarizes the business information extracted from the existing site, followed by a structured gap analysis."
))

story.append(h2("Current Business Information Captured"))
story.append(std_table(
    [
        ["Category", "Detail"],
        ["Services offered", "Washing Machine, Refrigerator, Microwave, Water Dispenser, Air Conditioner, Dishwasher repair"],
        ["Service area", "Kashmir — Srinagar, Anantnag, Baramulla, Budgam, Pulwama, Ganderbal, Bandipora, Kupwara"],
        ["Key selling points", "24/7 service, same-day service, certified technicians, genuine parts, warranty service"],
        ["Trust signals", "500+ repairs, 10+ cities served, 8+ major brands, 9 customer reviews, 4.8 rating"],
        ["Brand footprint", "Samsung, LG, Whirlpool, Bosch, IFB, Godrej, Haier, Voltas, Panasonic"],
        ["Contact options shown", "Phone number, WhatsApp click-to-chat, simple contact form"],
    ],
    col_ratios=[0.30, 0.70]
))
story.append(Spacer(1, 14))

story.append(h2("Gap Analysis — Where the Current Site Falls Short"))
story.append(p(
    "Each gap below represents both a missed SEO opportunity and a friction point for potential customers. The right-hand column maps each gap to the specific phase of this overhaul that addresses it."
))
story.append(std_table(
    [
        ["Gap / Weakness", "Impact on Business", "Fix in This Project"],
        ["Single-page architecture", "All keywords compete for one URL; relevance signals diluted", "Phase 2 — 25+ page multi-page architecture"],
        ["No dedicated service pages", "Cannot rank for \"washing machine repair\", \"AC service\" etc.", "Phase 3 — 6 service pages, 500+ words each"],
        ["No dedicated location pages", "Cannot rank for \"repair in Srinagar\", \"repair in Anantnag\" etc.", "Phase 3 — 8 location pages, 300-400 words each"],
        ["No online booking system", "Customers must call or WhatsApp — friction, lost overnight leads", "Phase 4 — multi-step booking form + CRM integration"],
        ["No payment integration", "Cannot collect advance/service fees online", "Phase 4 — Razorpay/UPI integration"],
        ["Missing legal pages", "Privacy, Terms, Warranty policy absent — GDPR/IT Act compliance risk", "Phase 3 — 3 legal pages drafted"],
        ["No blog or educational content", "Misses informational search traffic; no authority signal", "Phase 3 — 5 blog articles + 10 topic ideas"],
        ["Basic design and branding", "Looks like a 2015 template; weak mobile UX", "Phase 4 — GeneratePress + custom design system"],
        ["No schema markup", "No rich snippets in SERPs, no Local Business signals to Google", "Phase 4 — LocalBusiness + FAQ + Service schema"],
        ["No Google Business Profile optimization", "Inconsistent NAP, no review funnel", "Phase 5 — Post-launch GBP optimization plan"],
        ["No FAQ section", "Misses FAQ rich snippets; customers call for repeatable questions", "Phase 3 — 15+ question FAQ with FAQ Schema"],
        ["No analytics or Search Console", "Cannot measure traffic, conversions, or keyword performance", "Phase 4 — GA4 + GSC + tag manager setup"],
    ],
    col_ratios=[0.30, 0.40, 0.30]
))
story.append(Spacer(1, 12))
story.append(callout_box(
    "Strategic Insight",
    "The single biggest unlock is not a design refresh — it is the move from 1 URL to 25+ URLs. Each new page is a new opportunity to rank for a specific service, a specific city, and a specific brand. The compound effect of 25 indexed pages with proper internal linking is typically a 3-5x increase in organic search visibility within 6 months for local service businesses of this size.",
    color=ACCENT_2, bg=CARD_BG
))

story.append(PageBreak())

# ============== SECTION 3: KEYWORD RESEARCH ==============
story.append(h1("Phase 1.2 — Keyword Research"))
story.append(p(
    "The Kashmir appliance repair search market is fragmented across three intent layers: service-based queries (what is broken), location-based queries (where the customer is), and intent-based queries (what the customer wants to do next). A robust keyword strategy must capture all three layers. The tables below present a structured target keyword list grouped by category, with estimated monthly search volume (India-level, filtered to J&K region where possible) and a qualitative competition score (Low/Medium/High) based on the strength of currently ranking pages."
))
story.append(p(
    "Search volume estimates are indicative — actual volumes vary by season (AC repair peaks in May-July, refrigerator and washing machine queries peak during festival months Oct-Nov). Volumes marked \"Long-tail\" indicate low individual volume but high cumulative value across variants."
))

story.append(h2("A. Service-Based Keywords"))
story.append(std_table(
    [
        ["Keyword", "Intent", "Est. Volume/mo", "Competition", "Target Page"],
        ["washing machine repair Kashmir", "Commercial", "150-250", "Medium", "Service page"],
        ["washing machine not spinning", "Informational", "200-300", "Low", "Service + Blog"],
        ["washing machine not draining", "Informational", "150-220", "Low", "Blog article"],
        ["washing machine error code", "Informational", "120-180", "Low", "Blog + Service"],
        ["refrigerator repair Srinagar", "Commercial", "120-180", "Medium", "Service + Location"],
        ["fridge not cooling", "Informational", "250-350", "Medium", "Blog + Service"],
        ["fridge leaking water", "Informational", "100-150", "Low", "Blog article"],
        ["AC service Srinagar", "Commercial", "200-300", "Medium-High", "Service page"],
        ["AC gas refill Kashmir", "Transactional", "80-120", "Low-Medium", "Service page"],
        ["AC not cooling", "Informational", "300-400", "Medium", "Blog + Service"],
        ["microwave repair near me", "Commercial", "150-220", "High", "Service page"],
        ["microwave not heating", "Informational", "180-260", "Low-Medium", "Blog + Service"],
        ["water dispenser repair", "Commercial", "60-100", "Low", "Service page"],
        ["dishwasher repair Kashmir", "Commercial", "40-80", "Low", "Service page"],
        ["Samsung washing machine repair", "Commercial", "200-280", "Medium-High", "Brand page"],
        ["LG refrigerator technician", "Commercial", "150-220", "Medium-High", "Brand page"],
        ["Whirlpool service center Kashmir", "Commercial", "80-120", "Medium", "Brand page"],
        ["Bosch dishwasher service", "Commercial", "40-70", "Low", "Brand page"],
    ],
    col_ratios=[0.32, 0.16, 0.16, 0.18, 0.18]
))

story.append(Spacer(1, 14))
story.append(h2("B. Location-Based Keywords (Sample — One per City)"))
story.append(p(
    "Each of the 8 location pages will target a primary \"appliance repair [city]\" keyword plus 6-8 secondary \"service + city\" combinations. The table below shows the primary keyword per location; the full keyword set per location is provided in the corresponding location page content brief."
))
story.append(std_table(
    [
        ["City", "Primary Keyword", "Est. Volume/mo", "Secondary Keyword Examples"],
        ["Srinagar", "appliance repair Srinagar", "300-450", "washing machine repair Lal Chowk, AC repair Hyderpora, fridge repair Rajbagh"],
        ["Anantnag", "appliance repair Anantnag", "80-140", "AC repair Anantnag, refrigerator repair Khanabal"],
        ["Baramulla", "appliance repair Baramulla", "60-110", "washing machine repair Baramulla, microwave repair Baramulla"],
        ["Budgam", "appliance repair Budgam", "50-90", "fridge repair Budgam, AC repair Beerwah"],
        ["Pulwama", "appliance repair Pulwama", "40-80", "washing machine repair Pulwama, AC repair Pulwama"],
        ["Ganderbal", "appliance repair Ganderbal", "30-60", "refrigerator repair Ganderbal, microwave repair Ganderbal"],
        ["Bandipora", "appliance repair Bandipora", "20-50", "AC repair Bandipora, fridge repair Bandipora"],
        ["Kupwara", "appliance repair Kupwara", "20-50", "washing machine repair Kupwara, water dispenser repair Kupwara"],
    ],
    col_ratios=[0.14, 0.30, 0.18, 0.38]
))

story.append(Spacer(1, 14))
story.append(h2("C. Intent-Based Keywords"))
story.append(std_table(
    [
        ["Intent Type", "Sample Keywords", "Funnel Stage", "Content Format"],
        ["Informational", "how to fix a washing machine, why is my fridge leaking water, signs your AC needs repair", "Top of funnel (awareness)", "Blog articles, FAQ page"],
        ["Commercial", "best appliance repair in Kashmir, same-day AC repair near me, reliable washing machine service Srinagar", "Middle of funnel (consideration)", "Service pages, About page, Reviews page"],
        ["Transactional", "book washing machine repair, AC service cost in Srinagar, fridge repair price Kashmir, schedule dishwasher repair", "Bottom of funnel (decision)", "Booking form, service page CTAs, contact page"],
        ["Navigational", "WeCare Home Solutions, wecarehomesolutions.in, WeCare appliance repair contact", "Brand search", "Homepage, contact page, GBP"],
    ],
    col_ratios=[0.16, 0.42, 0.22, 0.20]
))

story.append(Spacer(1, 12))
story.append(callout_box(
    "Keyword Targeting Strategy",
    "Use the \"Pillar + Cluster\" model: each service page (e.g. Washing Machine Repair) is a pillar that links to location-specific washing machine repair sections on the 8 location pages, and to blog articles answering specific problem queries (\"washing machine not spinning\"). This concentrates topical authority and creates a clear internal linking map Google can crawl efficiently.",
    color=ACCENT, bg=CARD_BG
))

story.append(PageBreak())

# ============== SECTION 4: COMPETITOR ANALYSIS ==============
story.append(h1("Phase 1.3 — Competitor Analysis & Opportunities"))
story.append(p(
    "The Kashmir appliance repair market is served by a mix of national-brand authorized service centers (Samsung, LG, Whirlpool), local independent repair shops with basic websites or JustDial/IndiaMART listings, and a small number of multi-brand local repair businesses with their own websites. WeCare Home Solutions competes primarily in the third category — multi-brand local repair — which is also the category with the weakest digital presence and therefore the largest opportunity."
))

story.append(h2("Typical Competitor Profile — Kashmir Appliance Repair Websites"))
story.append(std_table(
    [
        ["Competitor Type", "Common Strengths", "Common Weaknesses"],
        ["National brand authorized service", "Strong domain authority, brand trust, official parts",
         "Slow response, expensive, no same-day service, generic local landing pages"],
        ["Independent repair shops (no website, only JustDial listings)",
         "Local trust, low prices, fast response",
         "No website, no SEO, no reviews management, no booking system, no content"],
        ["Multi-brand local repair businesses with basic websites",
         "Multiple services on one page, WhatsApp integration, phone numbers",
         "Single-page sites, no schema, no service-specific or location-specific pages, slow load, no blog, no GBP optimization"],
    ],
    col_ratios=[0.28, 0.36, 0.36]
))

story.append(Spacer(1, 12))
story.append(h2("Opportunity Map for WeCare Home Solutions"))
story.append(p(
    "The gaps in competitor websites are clear and exploitable. WeCare has the operational credentials (500+ repairs, 4.8 rating, certified technicians, genuine parts, warranty) to back up the marketing claims — the missing piece is the digital infrastructure that surfaces these credentials to searchers at the right moment."
))
story.append(std_table(
    [
        ["Opportunity", "Competitor Gap", "WeCare Action", "Expected Outcome (6-9 months)"],
        ["Local SEO dominance",
         "Competitors have no dedicated location pages; Google shows JustDial aggregators for \"repair in Srinagar\"",
         "Build 8 location pages with unique content, landmarks, and local schema",
         "Rank in top 3 for \"appliance repair [city]\" for all 8 cities"],
        ["Service-specific authority",
         "Competitors list services on one page; cannot rank for \"AC gas refill\" vs \"microwave repair\" separately",
         "6 dedicated service pages, 500+ words, with FAQ schema",
         "Top 5 ranking for primary service keywords"],
        ["Review-driven trust",
         "Competitor reviews scattered; no review funnel; ratings not surfaced",
         "Reviews page + \"Leave a Review\" CTA + automated post-service review request",
         "50+ new Google reviews in 6 months; rating maintained above 4.7"],
        ["Content authority",
         "No competitor publishes educational content",
         "Publish 2 blog articles/month answering real customer questions",
         "Capture informational long-tail traffic; build topical authority"],
        ["Conversion infrastructure",
         "All competitors use phone-only or WhatsApp-only; no structured booking",
         "Multi-step booking form with CRM integration + WhatsApp fallback",
         "Measurable lead funnel; 30-50% increase in qualified inquiries"],
        ["Schema-rich SERP presence",
         "No competitor uses schema markup",
         "LocalBusiness, FAQ, Service schema on every relevant page",
         "Rich snippets in SERPs (stars, FAQs, prices) → higher CTR"],
    ],
    col_ratios=[0.20, 0.30, 0.25, 0.25]
))

story.append(PageBreak())

# ============== SECTION 5: SITEMAP ==============
story.append(h1("Phase 2.1 — Site Architecture & Sitemap"))
story.append(p(
    "The new website is organized into six content clusters: Homepage, Service pages, Location pages, Brand pages, Legal pages, and Blog. Each page has a defined URL structure, target keyword set, and role in the conversion funnel. The total page count at launch is 25 indexed pages plus 3 legal pages (set to noindex but accessible from the footer for compliance)."
))

story.append(h2("URL Structure"))
story.append(p("The recommended URL pattern is short, keyword-rich, and uses hyphens as separators:"))
story.append(std_table(
    [
        ["Page Type", "URL Pattern", "Example", "Count"],
        ["Homepage", "/", "wecarehomesolutions.in/", "1"],
        ["Service page", "/services/{slug}/", "/services/washing-machine-repair/", "6"],
        ["Location page", "/locations/{city-slug}/", "/locations/srinagar/", "8"],
        ["Brand hub", "/brands/", "/brands/", "1"],
        ["Individual brand", "/brands/{brand-slug}/", "/brands/samsung/", "(optional, 8)"],
        ["About", "/about/", "/about/", "1"],
        ["Reviews", "/reviews/", "/reviews/", "1"],
        ["FAQ", "/faq/", "/faq/", "1"],
        ["Contact", "/contact/", "/contact/", "1"],
        ["Blog hub", "/blog/", "/blog/", "1"],
        ["Blog article", "/blog/{slug}/", "/blog/why-is-my-washing-machine-not-draining/", "5+ ongoing"],
        ["Privacy Policy", "/privacy-policy/", "/privacy-policy/", "1 (noindex)"],
        ["Terms & Conditions", "/terms/", "/terms/", "1 (noindex)"],
        ["Warranty Policy", "/warranty-policy/", "/warranty-policy/", "1 (noindex)"],
    ],
    col_ratios=[0.20, 0.25, 0.35, 0.20]
))

story.append(Spacer(1, 14))
story.append(h2("Visual Sitemap Tree"))
sitemap_text = """
WeCare Home Solutions
|
|-- Homepage (/)
|
|-- Services
|   |-- Washing Machine Repair
|   |-- Refrigerator Repair
|   |-- Air Conditioner Repair
|   |-- Microwave Repair
|   |-- Water Dispenser Repair
|   |-- Dishwasher Repair
|
|-- Locations
|   |-- Srinagar
|   |-- Anantnag
|   |-- Baramulla
|   |-- Budgam
|   |-- Pulwama
|   |-- Ganderbal
|   |-- Bandipora
|   |-- Kupwara
|
|-- Brands We Service (hub)
|
|-- About Us
|-- Customer Reviews
|-- FAQ
|-- Contact Us
|
|-- Blog (hub)
|   |-- 5 articles at launch, ongoing 2/month
|
|-- Legal (footer, noindex)
    |-- Privacy Policy
    |-- Terms & Conditions
    |-- Warranty / Service Policy
"""
mono_style = ParagraphStyle('Mono', fontName='DejaVuSans', fontSize=9, leading=13,
                             textColor=TEXT_PRIMARY, alignment=TA_LEFT, leftIndent=14)
story.append(Paragraph(sitemap_text.replace('\n', '<br/>'), mono_style))
story.append(Spacer(1, 14))

story.append(h2("SEO Priority Matrix"))
story.append(std_table(
    [
        ["Priority", "Page", "Reasoning"],
        ["P0 — Critical", "Homepage, 6 service pages, Srinagar location, Contact, Booking form", "Core conversion paths + highest-volume keywords"],
        ["P1 — High", "Other 7 location pages, Reviews, FAQ, About", "Local SEO coverage + trust signals"],
        ["P2 — Medium", "Blog hub + 5 articles, Brands hub, Privacy/Terms/Warranty", "Authority building + compliance"],
        ["P3 — Future", "Individual brand pages (Samsung, LG, etc.), additional blog content", "Scale after launch based on data"],
    ],
    col_ratios=[0.20, 0.45, 0.35]
))

story.append(PageBreak())

# ============== SECTION 6: CONTENT BRIEFS ==============
story.append(h1("Phase 2.2 — Content Briefs for Top 5 Pages"))
story.append(p(
    "Below are detailed content briefs for the five most important pages of the new website. The full written content for these and all other pages is delivered as separate Markdown files in the /content/ folder of this deliverable package. These briefs explain the strategic reasoning behind each page's structure so the developer and content team understand not just what to write but why."
))

# Homepage brief
story.append(h2("Brief 1 — Homepage"))
story.append(std_table(
    [
        ["Element", "Specification"],
        ["Primary keyword", "appliance repair Kashmir, WeCare Home Solutions"],
        ["Secondary keywords", "same-day appliance repair, certified technician Kashmir, multi-brand repair service"],
        ["Title tag", "WeCare Home Solutions — Same-Day Appliance Repair in Kashmir | 24/7 Service"],
        ["Meta description", "Kashmir's trusted multi-brand appliance repair service. Same-day washing machine, fridge, AC, microwave, dishwasher & water dispenser repair across 10+ cities. Certified technicians, genuine parts, warranty. Call now."],
        ["Word count target", "1,200 - 1,500 words across all sections"],
        ["H1", "Same-Day Appliance Repair Across Kashmir — Certified Technicians You Can Trust"],
        ["Required sections", "Hero (headline + CTA + trust badges), Trust stats strip, Services grid (6 cards), How We Work (3 steps), Locations covered (8 city chips), Featured testimonials (3), FAQ teaser (6 questions), Footer CTA"],
        ["CTA strategy", "Primary CTA \"Book a Repair\" in hero and sticky header; secondary CTA \"WhatsApp Us\" sticky bottom-right on mobile; tertiary CTA \"Call Now\" phone link prominent on mobile"],
        ["Internal linking", "Service cards → service pages; city chips → location pages; testimonials → reviews page; FAQ teaser → FAQ page"],
        ["Schema markup", "LocalBusiness schema (organization, address, geo, hours, phone, rating), FAQPage schema for FAQ teaser section"],
    ],
    col_ratios=[0.25, 0.75]
))
story.append(Spacer(1, 10))

# Washing Machine Repair brief
story.append(h2("Brief 2 — Washing Machine Repair Service Page"))
story.append(std_table(
    [
        ["Element", "Specification"],
        ["Primary keyword", "washing machine repair Kashmir"],
        ["Secondary keywords", "washing machine service Srinagar, washing machine not spinning, Samsung washing machine repair, LG washing machine technician, washing machine error code"],
        ["Title tag", "Washing Machine Repair in Kashmir — Same-Day Service for All Brands | WeCare"],
        ["Meta description", "Expert washing machine repair across Kashmir. Same-day service for Samsung, LG, Whirlpool, IFB, Bosch & more. Fixes for not spinning, not draining, error codes, leaking. Certified technicians, genuine parts, warranty. Book now."],
        ["Word count target", "600 - 800 words"],
        ["H1", "Washing Machine Repair in Kashmir — Same-Day Service for Every Brand & Problem"],
        ["Required sections", "Intro (problem + solution), Common problems we fix (6-8 items), Brands we service, Our repair process (3 steps), Why choose professional repair (benefits), Warranty information, Service areas, Customer testimonial (1), CTA, FAQ (5 questions)"],
        ["CTA", "Book a Washing Machine Repair (primary button) + WhatsApp Chat (secondary)"],
        ["Internal linking", "Brands → individual brand pages (if exists), Service areas → 8 location pages, Related services → Refrigerator/AC/Dishwasher pages"],
        ["Schema markup", "Service schema, FAQPage schema, BreadcrumbList schema"],
    ],
    col_ratios=[0.25, 0.75]
))
story.append(Spacer(1, 10))

# Refrigerator Repair brief
story.append(h2("Brief 3 — Refrigerator Repair Service Page"))
story.append(std_table(
    [
        ["Element", "Specification"],
        ["Primary keyword", "refrigerator repair Kashmir"],
        ["Secondary keywords", "fridge not cooling, refrigerator service Srinagar, LG refrigerator technician, fridge leaking water, freezer not freezing"],
        ["Title tag", "Refrigerator Repair in Kashmir — Fridge Not Cooling? We Fix It Today | WeCare"],
        ["Meta description", "Same-day refrigerator repair in Kashmir. Fixes for not cooling, leaking, freezing issues, compressor problems. All brands serviced — Samsung, LG, Whirlpool, Godrej, Haier. Genuine parts, warranty. Book now."],
        ["Word count target", "600 - 800 words"],
        ["H1", "Refrigerator Repair in Kashmir — Same-Day Fixes for Cooling, Leaking & Freezer Issues"],
        ["Required sections", "Intro, Common fridge problems (not cooling, leaking, over-freezing, compressor, thermostat, defrost), Brands we service, Repair process, Why professional service matters (food safety angle), Warranty, Service areas, Testimonial, CTA, FAQ"],
        ["CTA", "Book a Refrigerator Repair (primary) + WhatsApp (secondary)"],
        ["Schema markup", "Service, FAQ, BreadcrumbList"],
    ],
    col_ratios=[0.25, 0.75]
))
story.append(Spacer(1, 10))

# AC Repair brief
story.append(h2("Brief 4 — Air Conditioner Repair Service Page"))
story.append(std_table(
    [
        ["Element", "Specification"],
        ["Primary keyword", "AC repair Kashmir, AC service Srinagar"],
        ["Secondary keywords", "AC gas refill, AC not cooling, AC installation, split AC service, Voltas AC repair, LG AC technician"],
        ["Title tag", "AC Repair & Service in Kashmir — Gas Refill, Installation, All Brands | WeCare"],
        ["Meta description", "Same-day AC repair across Kashmir. Gas refill, not cooling fixes, installation, annual maintenance. All brands — Voltas, LG, Samsung, Daikin, Hitachi. Certified technicians, genuine parts. Book now."],
        ["Word count target", "600 - 800 words"],
        ["H1", "AC Repair & Service in Kashmir — Gas Refill, Installations & Cooling Fixes"],
        ["Required sections", "Intro (Kashmir summer angle), Common AC problems (not cooling, low cooling, gas refill, water leakage, noise, remote not working), Services offered (repair, gas refill, installation, AMC), Brands, Process, Why choose us (certified, genuine gas, warranty), Service areas, Testimonial, CTA, FAQ"],
        ["CTA", "Book an AC Repair / Book Free Site Visit (primary) + WhatsApp (secondary)"],
        ["Schema markup", "Service, FAQ, BreadcrumbList"],
    ],
    col_ratios=[0.25, 0.75]
))
story.append(Spacer(1, 10))

# Srinagar location brief
story.append(h2("Brief 5 — Srinagar Location Page"))
story.append(std_table(
    [
        ["Element", "Specification"],
        ["Primary keyword", "appliance repair Srinagar"],
        ["Secondary keywords", "washing machine repair Lal Chowk, AC repair Hyderpora, refrigerator repair Rajbagh, microwave repair Srinagar"],
        ["Title tag", "Appliance Repair in Srinagar — Same-Day Service Across All Localities | WeCare"],
        ["Meta description", "Trusted appliance repair service in Srinagar covering Lal Chowk, Hyderpora, Rajbagh, Karan Nagar, Sonwar, Bemina. Same-day washing machine, fridge, AC & microwave repair. Certified technicians. Book now."],
        ["Word count target", "350 - 450 words"],
        ["H1", "Appliance Repair in Srinagar — Same-Day Service Across All Localities"],
        ["Required sections", "Local intro (mention Srinagar context, Dal Lake, Lal Chowk), Neighborhoods/landmarks we cover (8-10 named areas), Services offered (list of 6 with links to service pages), Why Srinagar customers choose WeCare (local trust angle), Customer testimonial (1 Srinagar customer), CTA, Embedded Google Map, FAQ (3 location-specific questions)"],
        ["CTA", "Book a Repair in Srinagar (primary) + WhatsApp + Call Srinagar team"],
        ["Internal linking", "Service links → 6 service pages, Other location pages (cross-link), Contact page"],
        ["Schema markup", "LocalBusiness schema with Srinagar geo-coordinates, BreadcrumbList, FAQPage"],
        ["Unique content rule", "Must be 100% unique — no copy-paste from other location pages. Local landmarks and neighborhood names must be specific to Srinagar."],
    ],
    col_ratios=[0.25, 0.75]
))

story.append(PageBreak())

# ============== SECTION 7: TECH STACK ==============
story.append(h1("Phase 4.1 — Technology Stack Recommendation"))
story.append(p(
    "The choice of technology stack determines the long-term cost, ease of content updates, SEO flexibility, and the available pool of developers who can maintain the site. For WeCare Home Solutions — a growing local service business with non-technical owners — the recommended stack is WordPress with the GeneratePress theme and the Rank Math SEO plugin. This combination offers the best balance of SEO capability, content management ease, and total cost of ownership."
))

story.append(h2("Stack Comparison"))
story.append(std_table(
    [
        ["Criterion", "WordPress + GeneratePress", "Webflow", "Next.js (custom)"],
        ["SEO capability", "Excellent (Rank Math/Yoast; full control over schema, meta, sitemap)", "Very good (limited schema control without code)", "Excellent (full programmatic control)"],
        ["Ease of content updates", "Excellent — visual editor, content team can update without code", "Excellent — visual designer-friendly", "Poor — requires developer for content changes"],
        ["Cost (year 1)", "₹15,000-25,000 (hosting + premium theme + plugins)", "₹25,000-40,000/yr (CMS plan)", "₹80,000+ (custom development)"],
        ["Cost (ongoing)", "₹8,000-15,000/yr hosting", "₹25,000-40,000/yr", "₹0 software + dev maintenance cost"],
        ["Developer availability in India", "Very high", "Low", "Medium"],
        ["Booking system integration", "Mature plugins (WPForms, Amelia, BirchPress)", "Limited — Zapier-based", "Custom build required"],
        ["Performance (Core Web Vitals)", "Good with caching plugins", "Excellent", "Excellent"],
        ["Multi-page local SEO scale", "Excellent — easy to clone page templates", "Good", "Excellent but requires code"],
        ["Recommendation for WeCare", "RECOMMENDED — best balance", "Alternative for design-led teams", "Overkill for current scope"],
    ],
    col_ratios=[0.22, 0.26, 0.26, 0.26]
))
story.append(Spacer(1, 14))

story.append(h2("Recommended Plugin Stack"))
story.append(std_table(
    [
        ["Function", "Recommended Plugin", "Alternative", "Why"],
        ["SEO", "Rank Math", "Yoast SEO", "Rank Math is free, more feature-rich, includes schema builder, local SEO module"],
        ["Caching / Performance", "WP Rocket (paid)", "W3 Total Cache / LiteSpeed Cache", "WP Rocket is most reliable; if hosting has LiteSpeed, use LiteSpeed Cache (free)"],
        ["Security", "Wordfence (free tier)", "Sucuri", "Wordfence free is sufficient for a small business site"],
        ["Forms", "WPForms (Pro)", "Contact Form 7 / Gravity Forms", "WPForms has a multi-step form add-on needed for the booking system"],
        ["Booking / CRM", "HubSpot Free CRM + WPForms Zapier integration", "Pipedrive, Amelia Booking", "HubSpot free is enough for lead management; Amelia if you want calendar-based booking"],
        ["Analytics", "Google Analytics 4 + Site Kit plugin", "Independent GA4 setup", "Site Kit integrates GA4, Search Console, AdSense in one plugin"],
        ["Schema markup", "Rank Math built-in", "Schema Pro", "Rank Math covers LocalBusiness, FAQ, Service schema out of the box"],
        ["Image optimization", "ShortPixel or Smush", "Imagify", "Auto-compress and convert to WebP on upload"],
        ["Backup", "UpdraftPlus", "BackupBuddy", "Free tier sufficient; schedule daily off-site backups"],
        ["WhatsApp chat", "Click to Chat plugin", "Join.chat", "Lightweight WhatsApp click-to-chat widget"],
    ],
    col_ratios=[0.20, 0.30, 0.25, 0.25]
))

story.append(PageBreak())

# ============== SECTION 8: TECHNICAL SEO ==============
story.append(h1("Phase 4.2 — Technical SEO Configuration"))
story.append(p(
    "Technical SEO is the foundation that allows content to rank. Even the best-written page will fail to rank if search engines cannot crawl it, understand it, or render it properly. This section provides the complete technical SEO configuration for the new WeCare Home Solutions website, including on-page rules, schema markup, sitemap and robots.txt templates, redirect strategy, and performance optimization. All code samples referenced here are provided as separate files in the /code-samples/ folder of this deliverable."
))

story.append(h2("On-Page SEO Rules"))
story.append(p(
    "Every page on the new website must follow these on-page SEO rules. The Rank Math plugin enforces most of these via its content analysis, but the rules below should be the standard reference for the content team."
))
story.append(std_table(
    [
        ["Element", "Rule", "Example"],
        ["Title tag length", "50-60 characters", "\"Washing Machine Repair in Kashmir — Same-Day Service | WeCare\" (54 chars)"],
        ["Meta description length", "140-160 characters", "See content brief examples"],
        ["H1 per page", "Exactly one H1, contains primary keyword", "H1: \"Washing Machine Repair in Kashmir...\""],
        ["H2-H3 hierarchy", "Logical nesting; H2 for sections, H3 for sub-sections", "Never skip levels (H2 → H4 is forbidden)"],
        ["Image alt text", "Descriptive, contains keyword where natural", "alt=\"Samsung washing machine drum repair by WeCare technician\""],
        ["Image file naming", "kebab-case, descriptive", "samsung-washing-machine-drum-repair.jpg (NOT IMG_4032.jpg)"],
        ["Image format", "WebP for photos, SVG for icons", "Auto-convert via ShortPixel"],
        ["Internal linking", "Minimum 3 internal links per page to related content", "Service page → 3 location pages + 1 related service page + 1 blog article"],
        ["URL slug", "Short, hyphenated, keyword-rich, lowercase", "/services/washing-machine-repair/"],
        ["Canonical tag", "Self-canonical on every page", "Rank Math handles automatically"],
    ],
    col_ratios=[0.22, 0.40, 0.38]
))

story.append(Spacer(1, 14))
story.append(h2("Schema Markup"))
story.append(p(
    "Three schema types are required across the new website. The complete JSON-LD code for each is provided as separate files in /code-samples/ — this section explains what each schema does and where it should be deployed."
))
story.append(std_table(
    [
        ["Schema Type", "Where to Deploy", "What It Enables in SERPs"],
        ["LocalBusiness (with sub-type ApplianceRepair)", "Homepage + every location page (with location-specific address & geo)", "Business name, address, phone, hours, rating, price range in knowledge panel"],
        ["FAQPage", "FAQ page + every service page (FAQ section) + every location page (FAQ section)", "Expandable FAQ rich snippets directly in search results"],
        ["Service", "Every service page (6 pages)", "Service name, description, provider, area served, price range"],
        ["BreadcrumbList", "Every page except homepage", "Breadcrumb trail display in SERPs"],
        ["Review / AggregateRating", "Reviews page + LocalBusiness schema on homepage", "Star rating in SERPs and knowledge panel"],
        ["Organization", "Homepage ( sitewide via Rank Math)", "Brand logo, contact points in knowledge panel"],
    ],
    col_ratios=[0.30, 0.40, 0.30]
))
story.append(p(
    "Code samples for each schema type are saved as separate files in /code-samples/schema-localbusiness.json, schema-faq.json, schema-service.json. The sitemap and robots.txt are saved as sitemap.xml and robots.txt respectively. These can be uploaded directly to the WordPress root directory or placed via the Rank Math schema module."
))

story.append(Spacer(1, 12))
story.append(h2("Sitemap & Robots.txt"))
story.append(p(
    "WordPress with Rank Math automatically generates a dynamic sitemap at /sitemap_index.xml. The sample sitemap.xml file in /code-samples/ is a static reference for what the sitemap should contain — useful for custom platforms or for verifying the Rank Math output. The robots.txt file in /code-samples/ blocks WordPress admin and plugin folders, allows the rest of the site, and points to the sitemap URL."
))

story.append(Spacer(1, 12))
story.append(h2("301 Redirect Strategy (Old → New)"))
story.append(p(
    "The existing single-page website has accumulated some domain authority and possibly a few backlinks. To preserve this equity, set up 301 redirects from the old URL structure to the most relevant new pages. Use the Redirection plugin (free) for WordPress or .htaccess for non-WordPress platforms."
))
story.append(std_table(
    [
        ["Old URL", "New URL", "Reason"],
        ["/ (homepage anchor sections like #services)", "/services/ (hub) or specific service pages", "Old anchor links now have their own pages"],
        ["/#contact", "/contact/", "Contact now has its own page"],
        ["/#about", "/about/", "About now has its own page"],
        ["/#reviews", "/reviews/", "Reviews now has its own page"],
        ["/index.html", "/", "Canonical homepage"],
        ["Any legacy /p/ or /page/ URLs", "Closest matching service/location page", "Preserve link equity"],
    ],
    col_ratios=[0.40, 0.35, 0.25]
))

story.append(Spacer(1, 12))
story.append(h2("Performance Optimization Checklist"))
story.append(std_table(
    [
        ["Category", "Action", "Tool / Plugin"],
        ["Image optimization", "Auto-compress + WebP conversion on upload; lazy-load images below the fold", "ShortPixel / Smush + Rank Math lazy-load"],
        ["Browser caching", "Set 1-year cache for static assets via .htaccess or caching plugin", "WP Rocket / LiteSpeed Cache"],
        ["CDN", "Serve static assets via Cloudflare free tier; configure India edge POPs", "Cloudflare (free)"],
        ["Minify CSS/JS/HTML", "Auto-minify via caching plugin; remove unused CSS", "WP Rocket / Autoptimize"],
        ["Critical CSS", "Generate above-the-fold CSS for the homepage and service pages", "WP Rocket Critical CSS feature"],
        ["Database optimization", "Weekly cleanup of post revisions, spam, transients", "WP-Optimize"],
        ["Core Web Vitals target", "LCP < 2.5s, FID < 100ms, CLS < 0.1 on mobile", "Test with PageSpeed Insights + Search Console"],
        ["Server response time", "TTFB < 600ms on mobile; use PHP 8.2+, latest MySQL", "Hosting provider (Hostinger / Cloudways)"],
    ],
    col_ratios=[0.25, 0.45, 0.30]
))

story.append(PageBreak())

# ============== SECTION 9: KEY FUNCTIONALITIES ==============
story.append(h1("Phase 4.3 — Key Functionalities"))
story.append(p(
    "Beyond content and SEO, the new website must function as a lead generation tool. This section specifies four critical functional features: the online booking system, the WhatsApp live chat integration, the pincode/service-area checker, and the customer reviews management workflow. Each feature is described in terms of user flow, integration requirements, and developer reference."
))

story.append(h2("A. Online Booking System"))
story.append(p(
    "The booking system is the primary conversion tool of the new website. It must be a multi-step form that progressively qualifies the lead without overwhelming the user. Each step should ask one question, show progress, and allow back navigation. On submission, the lead should be saved to a CRM (HubSpot Free recommended), trigger an automated confirmation SMS and email to the customer, and notify the WeCare team via WhatsApp and email."
))
story.append(std_table(
    [
        ["Step", "Field(s)", "Input Type", "Validation"],
        ["1. Select Appliance", "Appliance type", "Radio cards (6 options + Other)", "Required"],
        ["2. Describe Issue", "Problem description, Brand, Model (optional)", "Multi-line text + dropdown brand + free text model", "Description required"],
        ["3. Select Date & Time", "Preferred date, Preferred time slot", "Date picker + 4 slot radio buttons (Morning/Afternoon/Evening/Night)", "Required; date >= today"],
        ["4. Address & Contact", "Full name, Phone, Address line 1, City (auto-filled from referrer), Pincode", "Text inputs + pincode 6-digit", "All required; phone 10 digits"],
        ["5. Confirm & Submit", "Review summary, consent checkbox for SMS confirmation", "Read-only summary + checkbox + Submit button", "Checkbox required"],
    ],
    col_ratios=[0.20, 0.30, 0.30, 0.20]
))
story.append(Spacer(1, 10))
story.append(p(
    "Implementation: Use WPForms Pro with the Multi-Step Form add-on, or Gravity Forms with the Page Break field. Connect WPForms to HubSpot Free CRM via the official HubSpot WPForms addon (no Zapier needed). For SMS/email automation, use the HubSpot workflows (free tier allows up to 5 automated workflows). A reference HTML/JS prototype of the multi-step form is provided in /code-samples/booking-form.html for the developer to use as UX reference."
))

story.append(h2("B. WhatsApp Live Chat Integration"))
story.append(p(
    "WhatsApp is the dominant communication channel in Kashmir. A floating WhatsApp button should appear on every page (sticky bottom-right on mobile, bottom-right on desktop). Clicking it opens WhatsApp with a pre-filled message that includes the page URL the user was on, allowing the WeCare team to understand context immediately."
))
story.append(p(
    "Implementation: Use the \"Click to Chat\" WordPress plugin (free) for the basic floating button. For the pre-filled message with page URL, add a small JS snippet that updates the wa.me link href on page load. The message template should be: \"Hi WeCare team, I'm on the [page name] page on your website and need help with [appliance/service].\" The complete code snippet is provided in /code-samples/whatsapp-widget.html."
))

story.append(h2("C. Pincode / Service Area Checker"))
story.append(p(
    "A lightweight tool on the homepage and contact page that lets users enter their pincode and instantly see whether WeCare serves their area, plus a direct link to their location page if applicable. This reduces friction for out-of-area users (clear \"not served\" message) and creates an internal-linking signal for in-area users."
))
story.append(p(
    "Implementation: Maintain a JSON array of serviceable pincodes mapped to location pages. On submit, check the user's pincode against the array; if matched, show a success message with a CTA to the location page; if not, show a polite out-of-area message with a phone number for confirmation. The complete code (HTML + JS + sample pincode JSON) is provided in /code-samples/area-checker.html and /code-samples/serviceable-pincodes.json."
))

story.append(h2("D. Customer Reviews Management"))
story.append(p(
    "Reviews are the single biggest trust signal in a local service business. The new website must (1) display existing Google reviews on a dedicated Reviews page using the Google Places API or an embedding plugin, (2) include a prominent \"Leave a Review\" button that links directly to the Google Business Profile review flow, and (3) feed every completed service into an automated review request workflow."
))
story.append(std_table(
    [
        ["Component", "Implementation", "Tool"],
        ["Reviews display", "Embed live Google reviews via plugin or Google Places API", "Google Reviews Widget plugin (free) or Places API"],
        ["\"Leave a Review\" CTA", "Button on Reviews page + every service page footer linking to GBP review URL", "Direct link: https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"],
        ["Post-service review request", "Automated SMS + email 24 hours after service completion", "HubSpot workflow triggered by stage change in CRM"],
        ["Review request template", "Personalized SMS with technician name, service date, and GBP review link", "See /code-samples/review-request-sms-template.txt"],
        ["Negative review handling", "Auto-detect 1-3 star ratings → trigger internal alert → response within 24 hours", "HubSpot workflow + Slack/email alert"],
    ],
    col_ratios=[0.25, 0.45, 0.30]
))

story.append(PageBreak())

# ============== SECTION 10: TIMELINE ==============
story.append(h1("Phase 5.1 — Implementation Timeline"))
story.append(p(
    "The complete overhaul can be delivered in 15 working days, with a 15-day post-launch monitoring and stabilization period. Content creation runs in parallel with development from day 4 to maximize throughput. The table below is the master schedule; the developer and content team should treat this as the working plan, with daily check-ins during the build phase."
))

story.append(std_table(
    [
        ["Phase", "Days", "Tasks", "Deliverables", "Owner"],
        ["1. Discovery & Strategy", "1-3",
         "Stakeholder kickoff, finalize sitemap, confirm keyword targets, audit existing assets, set up analytics accounts (GA4, GSC)",
         "Approved sitemap, keyword sheet, GA4+GSC configured",
         "Strategist + Client"],
        ["2. Design & Development", "4-12",
         "Wireframes → visual design → WordPress setup → theme customization → page templates → booking form → schema implementation → mobile testing",
         "Staging site with all page templates functional",
         "Developer + Designer"],
        ["3. Content Creation (parallel)", "4-10",
         "Write all 25 pages (homepage, 6 service, 8 location, 5 brand, 3 legal, 5 blog), SEO meta tags, image sourcing",
         "All content .md files delivered to developer",
         "Content writer + SEO"],
        ["4. Content Migration", "9-11",
         "Migrate content into WordPress pages, format headings, add internal links, upload images, set schema per page",
         "All pages populated on staging",
         "Developer + Content"],
        ["5. Testing & QA", "13-14",
         "Cross-browser testing, mobile testing, form submission tests, schema validation, page speed audit, broken link check, 301 redirect verification",
         "QA sign-off document, all issues resolved",
         "QA + Developer"],
        ["6. Launch & Go-Live", "15",
         "DNS cutover, SSL install, sitemap submission to GSC, final backup, post-launch smoke test",
         "Live site accessible, GSC indexing requested",
         "Developer + Client"],
        ["7. Post-Launch Monitoring", "16-30",
         "Daily uptime + speed checks, GSC error monitoring, weekly ranking report, content edits based on user behavior",
         "Weekly status report + final handover",
         "Strategist + Developer"],
    ],
    col_ratios=[0.20, 0.10, 0.30, 0.25, 0.15]
))

story.append(PageBreak())

# ============== SECTION 11: BUDGET ==============
story.append(h1("Phase 5.2 — Budget Estimation"))
story.append(p(
    "The budget is split into one-time project costs and annual recurring costs. All figures are in Indian Rupees (INR) with USD equivalents shown for international stakeholders (exchange rate ₹83 ≈ $1). Costs assume a freelance development team and are indicative; agency rates may be 50-100% higher. Hosting recommendations assume shared/managed WordPress hosting suitable for a small business site."
))

story.append(h2("One-Time Project Costs"))
story.append(std_table(
    [
        ["Category", "Detail", "INR", "USD (~₹83/$)"],
        ["Web development", "WordPress setup, theme customization, 25 page templates, booking form, schema, mobile optimization", "₹60,000 - ₹1,20,000", "$720 - $1,450"],
        ["Visual design", "Custom logo refresh (optional), homepage hero, service icons, brand color system", "₹15,000 - ₹35,000", "$180 - $420"],
        ["Content writing", "25 pages @ ₹1,500-2,500/page (homepage ₹5,000) + 5 blog articles @ ₹1,500/article", "₹55,000 - ₹85,000", "$660 - $1,025"],
        ["SEO setup", "Keyword research, schema implementation, sitemap, robots.txt, GSC/GA4 setup, 301 redirects", "₹25,000 - ₹40,000", "$300 - $480"],
        ["Booking system integration", "WPForms Pro + HubSpot CRM setup + automation workflows", "₹15,000 - ₹25,000", "$180 - $300"],
        ["Testing & QA", "Cross-browser, mobile, performance, schema validation", "₹10,000 - ₹20,000", "$120 - $240"],
        ["Project management", "15-day engagement, daily standups, client communication", "₹15,000 - ₹25,000", "$180 - $300"],
        ["TOTAL ONE-TIME", "", "₹1,95,000 - ₹3,50,000", "$2,340 - $4,215"],
    ],
    col_ratios=[0.22, 0.48, 0.18, 0.12]
))

story.append(Spacer(1, 14))
story.append(h2("Annual Recurring Costs"))
story.append(std_table(
    [
        ["Category", "Detail", "INR/yr", "USD/yr"],
        ["Domain", "wecarehomesolutions.in renewal", "₹1,000 - ₹1,500", "$12 - $18"],
        ["Hosting", "Managed WordPress hosting (Hostinger / Cloudways / BigRock)", "₹5,000 - ₹15,000", "$60 - $180"],
        ["Premium plugins", "WP Rocket + WPForms Pro + ShortPixel (yearly renewals)", "₹8,000 - ₹15,000", "$96 - $180"],
        ["CDN", "Cloudflare free tier (sufficient for traffic level)", "₹0", "$0"],
        ["HubSpot CRM", "Free tier (sufficient for current lead volume)", "₹0", "$0"],
        ["Maintenance retainer (optional)", "5 hours/month: backups, updates, security, minor edits", "₹30,000 - ₹60,000", "$360 - $720"],
        ["Content marketing (optional)", "2 blog articles/month @ ₹1,500", "₹36,000", "$435"],
        ["TOTAL ANNUAL", "Without retainer/content", "₹14,000 - ₹31,500", "$170 - $380"],
        ["TOTAL ANNUAL", "With retainer + content marketing", "₹80,000 - ₹1,27,500", "$960 - $1,535"],
    ],
    col_ratios=[0.22, 0.48, 0.18, 0.12]
))

story.append(Spacer(1, 14))
story.append(callout_box(
    "Total Investment Summary",
    "One-time project: ₹1.95L - ₹3.50L ($2,340 - $4,215). Annual recurring (basic): ₹14K - ₹31.5K ($170 - $380). With content marketing & maintenance retainer: ₹80K - ₹1.28L ($960 - $1,535) per year. Recommended starting package: One-time ₹2.5L + Annual ₹50K for year 1, scaling content marketing in year 2 once ROI is proven.",
    color=ACCENT_2, bg=CARD_BG
))

story.append(PageBreak())

# ============== SECTION 12: POST-LAUNCH STRATEGY ==============
story.append(h1("Phase 5.3 — Post-Launch Strategy & Next Steps"))
story.append(p(
    "Launch is the starting line, not the finish line. The new website will reach its full potential only with a sustained 6-12 month post-launch program covering Google Business Profile optimization, review generation, content marketing, local citation building, and quarterly SEO audits. This section provides the 30/60/90 day roadmap and the long-term playbook."
))

story.append(h2("30/60/90 Day Roadmap"))
story.append(std_table(
    [
        ["Period", "Focus", "Key Actions", "Success Metrics"],
        ["Days 1-30", "Stabilization & GBP",
         "Submit sitemap to GSC, monitor indexing, fix 404s, optimize Google Business Profile (categories, photos, services, Q&A, posts), set up review request workflow",
         "All 25 pages indexed; GBP completeness score ≥ 95%; first 10 new Google reviews"],
        ["Days 31-60", "Content Cadence & Local Citations",
         "Publish 2 blog articles/month, build local citations on JustDial, IndiaMART, Sulekha, JustDial Kashmir, Yellow Pages, local business directories; respond to all reviews",
         "8-12 published citations; 4 blog articles published; review response rate 100%"],
        ["Days 61-90", "Conversion Optimization & First Audit",
         "Run full technical SEO audit (Ahrefs/Semrush free trial or Screaming Frog), analyze GA4 user flow, A/B test CTA button copy and placement, add exit-intent popup",
         "Audit report with action items; conversion rate baseline established; CTA test results"],
    ],
    col_ratios=[0.15, 0.20, 0.45, 0.20]
))

story.append(Spacer(1, 14))
story.append(h2("Long-Term SEO & Growth Playbook"))
story.append(h3("1. Google Business Profile Optimization"))
story.append(p(
    "The single highest-ROI activity for a local service business. Complete every GBP field: primary category (Appliance Repair Service), secondary categories (Refrigerator Repair Service, Air Conditioning Repair Service, etc.), service area (8 cities), business hours (24/7 if applicable, otherwise accurate), photos (logo, team, van, before/after repairs, technician at work, certificates), services list (link each to website service page), and Q&A section (seed 5-10 common questions with answers). Post weekly GBP updates announcing new services, completed jobs, or seasonal offers. GBP posts appear in local pack results and increase click-through rate by 20-30% on average."
))

story.append(h3("2. Customer Review Generation"))
story.append(p(
    "Reviews are a flywheel: more reviews → higher ranking → more customers → more reviews. The workflow is: (1) after every completed service, the technician enters the customer into HubSpot CRM with phone and email, (2) 24 hours later an automated SMS sends a personalized review request with the GBP review link, (3) 3 days later a follow-up email is sent if no review has been left, (4) all reviews — positive and negative — are responded to within 24 hours. Target: 4-6 new reviews per month. Reply template: \"Thank you [customer name] for trusting WeCare with your [appliance]. We're glad our technician [name] could help. Please consider leaving a Google review — it takes 30 seconds and helps other Kashmir families find reliable service. [link]\""
))

story.append(h3("3. Content Marketing Cadence"))
story.append(p(
    "Publish 2 blog articles per month, each answering a real customer question identified from Google Search Console (Queries report), customer calls, or FAQs. Article structure: 700-1,200 words, H2 sections, FAQ section with FAQ schema, 1 featured image + 2 in-content images, internal links to relevant service and location pages. Promote each article via GBP post, WhatsApp status, and the WeCare Facebook page (if active). Repurpose top-performing articles into short reels or carousels for Instagram."
))

story.append(h3("4. Local Citations & Link Building"))
story.append(p(
    "Submit WeCare to all major Indian business directories: JustDial, IndiaMART, Sulekha, TradeIndia, Yellow Pages India, and Kashmir-specific portals (Kashmiri portals, Kashmir Horizon business directory). Ensure NAP (Name, Address, Phone) is 100% consistent across all citations — even small variations (\"Srinagar, J&K\" vs \"Srinagar, Kashmir\") damage local SEO. Seek partnerships with local real estate agents, interior designers, and appliance retailers for mutual link building. Sponsor a local event or sports team for a high-quality backlink."
))

story.append(h3("5. Quarterly SEO Audit"))
story.append(p(
    "Every 90 days, run a full audit: (a) technical crawl with Screaming Frog (free up to 500 URLs) or Sitebulb, (b) ranking report for all target keywords, (c) GA4 traffic and conversion analysis, (d) Google Search Console review for new keyword opportunities and manual actions, (e) competitor ranking movement review. Convert the audit findings into a 10-15 item action list, prioritize by impact and effort, and execute before the next audit cycle."
))

story.append(h3("6. Conversion Rate Optimization (CRO)"))
story.append(p(
    "After 90 days of traffic data, identify the highest-traffic page with the lowest conversion rate and A/B test one variable at a time: CTA button copy (\"Book a Repair\" vs \"Get Same-Day Service\"), CTA button color, hero image, headline, number of form fields. Run each test for at least 2 weeks or until statistical significance (100+ conversions per variant). Implement the winner and move to the next test. Continuous CRO compounds: a 10% conversion rate improvement every quarter translates to 46% annual growth in leads from the same traffic."
))

story.append(PageBreak())

# ============== APPENDIX ==============
story.append(h1("Appendix A — Deliverables Index"))
story.append(p(
    "This strategy report is one of more than 30 deliverable files in this project package. The full set is organized into the folder structure below. Each file is named descriptively and contains ready-to-use content for the developer and content team."
))

story.append(h2("Strategy Report (this document)"))
story.append(std_table(
    [
        ["File", "Description"],
        ["WeCare-Home-Solutions-Website-Overhaul-Strategy.pdf", "This complete strategy report — Phases 1, 2, 4, 5 + Appendix"],
    ],
    col_ratios=[0.40, 0.60]
))

story.append(h2("Website Content Files (Markdown)"))
story.append(std_table(
    [
        ["Folder / File", "Description"],
        ["/content/homepage/homepage.md", "Homepage hero, services grid, process, testimonials, FAQ — ready to paste into WordPress"],
        ["/content/service-pages/washing-machine-repair.md", "Full 600+ word service page with meta, H1, body, FAQ, CTA"],
        ["/content/service-pages/refrigerator-repair.md", "Full refrigerator repair service page"],
        ["/content/service-pages/air-conditioner-repair.md", "Full AC repair service page"],
        ["/content/service-pages/microwave-repair.md", "Full microwave repair service page"],
        ["/content/service-pages/water-dispenser-repair.md", "Full water dispenser repair service page"],
        ["/content/service-pages/dishwasher-repair.md", "Full dishwasher repair service page"],
        ["/content/location-pages/srinagar.md", "Srinagar location page (unique content)"],
        ["/content/location-pages/anantnag.md", "Anantnag location page (unique)"],
        ["/content/location-pages/baramulla.md", "Baramulla location page (unique)"],
        ["/content/location-pages/budgam.md", "Budgam location page (unique)"],
        ["/content/location-pages/pulwama.md", "Pulwama location page (unique)"],
        ["/content/location-pages/ganderbal.md", "Ganderbal location page (unique)"],
        ["/content/location-pages/bandipora.md", "Bandipora location page (unique)"],
        ["/content/location-pages/kupwara.md", "Kupwara location page (unique)"],
        ["/content/brand-pages/about-us.md", "About Us page content"],
        ["/content/brand-pages/reviews.md", "Reviews page with 9 existing reviews + Leave a Review section"],
        ["/content/brand-pages/faq.md", "15+ question FAQ page (FAQ Schema ready)"],
        ["/content/brand-pages/contact-us.md", "Contact page content with NAP, form, map, WhatsApp"],
        ["/content/brand-pages/brands-we-service.md", "Brands hub page listing 8+ brands"],
        ["/content/legal-pages/privacy-policy.md", "Privacy Policy (IT Act 2000 + GDPR reference)"],
        ["/content/legal-pages/terms-and-conditions.md", "Terms & Conditions of service"],
        ["/content/legal-pages/warranty-policy.md", "Warranty / Service Policy"],
        ["/content/blog/blog-topic-ideas.md", "10-15 blog topic ideas with outlines"],
        ["/content/blog/why-is-my-washing-machine-not-draining.md", "Full 600+ word blog article"],
        ["/content/blog/signs-your-refrigerator-needs-repair.md", "Full 600+ word blog article"],
        ["/content/blog/summer-ac-maintenance-tips.md", "Full 600+ word blog article"],
        ["/content/blog/how-to-extend-the-life-of-your-microwave.md", "Full 600+ word blog article"],
        ["/content/blog/common-ac-error-codes-explained.md", "Full 600+ word blog article"],
    ],
    col_ratios=[0.45, 0.55]
))

story.append(Spacer(1, 14))
story.append(h2("Code Samples"))
story.append(std_table(
    [
        ["File", "Description"],
        ["/code-samples/schema-localbusiness.json", "LocalBusiness schema JSON-LD for homepage + location pages"],
        ["/code-samples/schema-faq.json", "FAQPage schema JSON-LD for FAQ and service pages"],
        ["/code-samples/schema-service.json", "Service schema JSON-LD for service pages"],
        ["/code-samples/sitemap.xml", "Sample XML sitemap covering all pages"],
        ["/code-samples/robots.txt", "Robots.txt with sitemap reference"],
        ["/code-samples/booking-form.html", "Multi-step booking form HTML/JS prototype"],
        ["/code-samples/whatsapp-widget.html", "WhatsApp floating button with pre-filled message"],
        ["/code-samples/area-checker.html", "Pincode service area checker tool"],
        ["/code-samples/serviceable-pincodes.json", "Pincode → location page mapping data"],
        ["/code-samples/review-request-sms-template.txt", "SMS template for post-service review requests"],
    ],
    col_ratios=[0.45, 0.55]
))

story.append(Spacer(1, 14))
story.append(h2("How to Use This Package"))
story.append(p(
    "Hand this entire package to your developer with the following instruction: \"Build the new WeCare Home Solutions website using the Strategy PDF as the master brief, populate each page with the content from the matching .md file in /content/, and deploy the technical configurations from the /code-samples/ files. The 30-day timeline in Section 10 of the PDF is the project schedule.\""
))
story.append(p(
    "For the business owner: read the Executive Summary (Section 1) and Phase 5.3 Post-Launch Strategy (Section 12) carefully — these two sections explain what you are buying and what you need to do after launch to make the investment pay off. The technical sections can be skimmed or delegated to your developer."
))

# Build the PDF
output_path = '/home/z/my-project/download/wecare-website-overhaul/WeCare-Home-Solutions-Website-Overhaul-Strategy.pdf'
doc = TocDocTemplate(
    output_path,
    pagesize=A4,
    leftMargin=0.75*inch,
    rightMargin=0.75*inch,
    topMargin=0.75*inch,
    bottomMargin=0.85*inch,
    title="WeCare Home Solutions — Website Overhaul Strategy",
    author="Z.ai Digital Strategy Advisory",
    subject="Complete website overhaul strategy for WeCare Home Solutions Kashmir",
    creator="Z.ai"
)

doc.multiBuild(story, onFirstPage=footer_page_number, onLaterPages=footer_page_number)

print(f"PDF generated: {output_path}")
print(f"File size: {os.path.getsize(output_path) / 1024:.1f} KB")
