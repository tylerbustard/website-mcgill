Sub CreateResumeTemplate()
    ' VBA Code to Generate 2-Page Resume Template Matching Website Design
    ' Colors and fonts match the Apple-inspired website design
    
    Dim doc As Document
    Dim rng As Range
    Dim tbl As Table
    Dim headerShape As Shape
    
    ' Create new document
    Set doc = Documents.Add
    doc.Range.Font.Name = "SF Pro Text"
    If doc.Range.Font.Name <> "SF Pro Text" Then
        doc.Range.Font.Name = "Segoe UI" ' Fallback if SF Pro not available
    End If
    
    ' Set document margins (narrow for modern look)
    With doc.Range.PageSetup
        .TopMargin = InchesToPoints(0.5)
        .BottomMargin = InchesToPoints(0.5)
        .LeftMargin = InchesToPoints(0.7)
        .RightMargin = InchesToPoints(0.7)
    End With
    
    ' Set background color to match website
    doc.Range.Shading.BackgroundPatternColor = RGB(245, 245, 247) ' #f5f5f7
    
    ' PAGE 1 - Header Section
    Set rng = doc.Range
    
    ' Create header with blue accent
    Set headerShape = doc.Shapes.AddTextbox(msoTextOrientationHorizontal, 0, 0, InchesToPoints(7.5), InchesToPoints(1.2))
    With headerShape
        .Fill.ForeColor.RGB = RGB(0, 123, 255) ' Primary blue color
        .Line.Visible = msoFalse
        .TextFrame.MarginLeft = InchesToPoints(0.3)
        .TextFrame.MarginTop = InchesToPoints(0.2)
        .TextFrame.MarginRight = InchesToPoints(0.3)
        .TextFrame.MarginBottom = InchesToPoints(0.2)
        
        With .TextFrame.TextRange
            .Text = "[Your Name]" & vbCrLf & "[Your Title/Position]"
            .Font.Name = "SF Pro Display"
            If .Font.Name <> "SF Pro Display" Then .Font.Name = "Segoe UI Semibold"
            .Font.Size = 24
            .Font.Bold = True
            .Font.Color.RGB = RGB(255, 255, 255)
            .ParagraphFormat.Alignment = wdAlignParagraphLeft
            .ParagraphFormat.SpaceAfter = 0
        End With
    End With
    
    ' Move cursor below header
    rng.Collapse wdCollapseEnd
    rng.InsertAfter vbCrLf & vbCrLf & vbCrLf
    rng.Collapse wdCollapseEnd
    
    ' Contact Information Section
    With rng
        .InsertAfter "CONTACT INFORMATION" & vbCrLf
        .Font.Name = "SF Pro Text"
        .Font.Size = 12
        .Font.Bold = True
        .Font.Color.RGB = RGB(0, 123, 255)
        .ParagraphFormat.SpaceBefore = 6
        .ParagraphFormat.SpaceAfter = 6
        .Collapse wdCollapseEnd
        
        .InsertAfter "Email: [your.email@example.com]" & vbCrLf
        .InsertAfter "Phone: [+1 (xxx) xxx-xxxx]" & vbCrLf
        .InsertAfter "Location: [City, Province/State]" & vbCrLf
        .InsertAfter "LinkedIn: [linkedin.com/in/yourprofile]" & vbCrLf & vbCrLf
        .Font.Bold = False
        .Font.Color.RGB = RGB(102, 102, 102)
        .Font.Size = 10
        .ParagraphFormat.LineSpacing = LinesToPoints(1.2)
        .Collapse wdCollapseEnd
    End With
    
    ' Professional Summary Section (Card Style)
    CreateSection rng, "PROFESSIONAL SUMMARY", _
        "Results-driven [Your Profession] with [X] years of experience in [Industry/Field]. " & _
        "Proven track record of [Key Achievement]. Skilled in [Key Skills] and passionate about [Area of Interest]. " & _
        "Seeking to leverage expertise in [Specific Area] to drive [Company Goal/Objective].", True
    
    ' Experience Section
    With rng
        .InsertAfter "EXPERIENCE" & vbCrLf
        .Font.Name = "SF Pro Text"
        .Font.Size = 12
        .Font.Bold = True
        .Font.Color.RGB = RGB(0, 123, 255)
        .ParagraphFormat.SpaceBefore = 12
        .ParagraphFormat.SpaceAfter = 8
        .Collapse wdCollapseEnd
    End With
    
    ' Experience Entry 1
    CreateExperienceEntry rng, "[Job Title]", "[Company Name]", "[City, Province/State]", "[Start Date] - [End Date]", _
        Array("• [Achievement with quantifiable result - increased/decreased/improved X by Y%]", _
              "• [Key responsibility that demonstrates relevant skills]", _
              "• [Another achievement showing impact and value added]")
    
    ' Experience Entry 2  
    CreateExperienceEntry rng, "[Previous Job Title]", "[Previous Company]", "[City, Province/State]", "[Start Date] - [End Date]", _
        Array("• [Achievement with quantifiable result]", _
              "• [Key responsibility with relevant skills]", _
              "• [Impact-focused accomplishment]")
    
    ' Skills Section (Card Style)
    CreateSkillsSection rng
    
    ' PAGE 2 - Education and Additional Sections
    rng.InsertBreak wdPageBreak
    
    ' Education Section
    CreateSection rng, "EDUCATION", "", False
    
    CreateEducationEntry rng, "[Degree Name]", "[University Name]", "[City, Province/State]", "[Graduation Year]", _
        "Relevant Coursework: [Course 1, Course 2, Course 3]" & vbCrLf & "GPA: [X.XX/4.0] (if notable)"
    
    ' Certifications Section (if applicable)
    CreateSection rng, "CERTIFICATIONS & LICENSES", "", False
    
    With rng
        .InsertAfter "• [Certification Name] - [Issuing Organization] ([Year])" & vbCrLf
        .InsertAfter "• [License/Certification Name] - [Issuing Body] ([Year])" & vbCrLf & vbCrLf
        .Font.Size = 10
        .Font.Color.RGB = RGB(102, 102, 102)
        .ParagraphFormat.LineSpacing = LinesToPoints(1.2)
        .Collapse wdCollapseEnd
    End With
    
    ' Projects Section (Card Style)
    CreateSection rng, "KEY PROJECTS", "", False
    
    CreateProjectEntry rng, "[Project Name]", "[Technologies Used]", _
        "Brief description of project, your role, and impact. Include metrics where possible."
    
    ' Additional Sections
    CreateSection rng, "LANGUAGES", "English (Native), [Other Language] ([Proficiency Level])", False
    
    CreateSection rng, "INTERESTS", "[Professional Interest 1], [Hobby/Interest 2], [Volunteer Activity], [Personal Interest]", False
    
    ' Apply consistent formatting
    FormatDocument doc
    
    ' Save document
    Dim fileName As String
    fileName = "Modern_Resume_Template_" & Format(Date, "yyyy-mm-dd")
    doc.SaveAs2 fileName & ".docx"
    
    MsgBox "Resume template created successfully!" & vbCrLf & "Saved as: " & fileName & ".docx", vbInformation
    
End Sub

Sub CreateSection(rng As Range, title As String, content As String, isCard As Boolean)
    ' Create a section with optional card styling
    
    With rng
        .InsertAfter title & vbCrLf
        .Font.Name = "SF Pro Text"
        .Font.Size = 12
        .Font.Bold = True
        .Font.Color.RGB = RGB(0, 123, 255)
        .ParagraphFormat.SpaceBefore = 12
        .ParagraphFormat.SpaceAfter = 8
        .Collapse wdCollapseEnd
    End With
    
    If content <> "" Then
        With rng
            .InsertAfter content & vbCrLf & vbCrLf
            .Font.Bold = False
            .Font.Color.RGB = RGB(102, 102, 102)
            .Font.Size = 10
            .ParagraphFormat.LineSpacing = LinesToPoints(1.2)
            
            If isCard Then
                ' Add subtle background and border for card effect
                .Shading.BackgroundPatternColor = RGB(255, 255, 255)
                .Borders(wdBorderTop).LineStyle = wdLineStyleSingle
                .Borders(wdBorderTop).Color = RGB(230, 230, 230)
                .Borders(wdBorderBottom).LineStyle = wdLineStyleSingle
                .Borders(wdBorderBottom).Color = RGB(230, 230, 230)
                .Borders(wdBorderLeft).LineStyle = wdLineStyleSingle
                .Borders(wdBorderLeft).Color = RGB(230, 230, 230)
                .Borders(wdBorderRight).LineStyle = wdLineStyleSingle
                .Borders(wdBorderRight).Color = RGB(230, 230, 230)
                .ParagraphFormat.LeftIndent = InchesToPoints(0.2)
                .ParagraphFormat.RightIndent = InchesToPoints(0.2)
            End If
            
            .Collapse wdCollapseEnd
        End With
    End If
End Sub

Sub CreateExperienceEntry(rng As Range, jobTitle As String, company As String, location As String, dateRange As String, achievements As Variant)
    ' Create an experience entry with timeline styling
    
    With rng
        ' Job Title and Company
        .InsertAfter jobTitle & " | " & company & vbCrLf
        .Font.Name = "SF Pro Text"
        .Font.Size = 11
        .Font.Bold = True
        .Font.Color.RGB = RGB(51, 51, 51)
        .ParagraphFormat.SpaceBefore = 8
        .ParagraphFormat.SpaceAfter = 2
        .Collapse wdCollapseEnd
        
        ' Location and Date
        .InsertAfter location & " | " & dateRange & vbCrLf
        .Font.Bold = False
        .Font.Size = 9
        .Font.Color.RGB = RGB(128, 128, 128)
        .Font.Italic = True
        .ParagraphFormat.SpaceAfter = 4
        .Collapse wdCollapseEnd
        
        ' Achievements
        Dim i As Integer
        For i = LBound(achievements) To UBound(achievements)
            .InsertAfter achievements(i) & vbCrLf
        Next i
        
        .InsertAfter vbCrLf
        .Font.Bold = False
        .Font.Size = 10
        .Font.Color.RGB = RGB(102, 102, 102)
        .Font.Italic = False
        .ParagraphFormat.LineSpacing = LinesToPoints(1.2)
        .ParagraphFormat.LeftIndent = InchesToPoints(0.1)
        .Collapse wdCollapseEnd
    End With
End Sub

Sub CreateEducationEntry(rng As Range, degree As String, university As String, location As String, gradYear As String, details As String)
    ' Create education entry
    
    With rng
        .InsertAfter degree & " | " & university & vbCrLf
        .Font.Name = "SF Pro Text"
        .Font.Size = 11
        .Font.Bold = True
        .Font.Color.RGB = RGB(51, 51, 51)
        .ParagraphFormat.SpaceBefore = 8
        .ParagraphFormat.SpaceAfter = 2
        .Collapse wdCollapseEnd
        
        .InsertAfter location & " | " & gradYear & vbCrLf
        .Font.Bold = False
        .Font.Size = 9
        .Font.Color.RGB = RGB(128, 128, 128)
        .Font.Italic = True
        .ParagraphFormat.SpaceAfter = 4
        .Collapse wdCollapseEnd
        
        .InsertAfter details & vbCrLf & vbCrLf
        .Font.Size = 10
        .Font.Color.RGB = RGB(102, 102, 102)
        .Font.Italic = False
        .ParagraphFormat.LineSpacing = LinesToPoints(1.2)
        .Collapse wdCollapseEnd
    End With
End Sub

Sub CreateProjectEntry(rng As Range, projectName As String, technologies As String, description As String)
    ' Create project entry with card styling
    
    With rng
        .InsertAfter projectName & vbCrLf
        .Font.Name = "SF Pro Text"
        .Font.Size = 11
        .Font.Bold = True
        .Font.Color.RGB = RGB(51, 51, 51)
        .ParagraphFormat.SpaceBefore = 8
        .ParagraphFormat.SpaceAfter = 2
        .Collapse wdCollapseEnd
        
        .InsertAfter "Technologies: " & technologies & vbCrLf
        .Font.Bold = False
        .Font.Size = 9
        .Font.Color.RGB = RGB(0, 123, 255)
        .Font.Italic = True
        .ParagraphFormat.SpaceAfter = 4
        .Collapse wdCollapseEnd
        
        .InsertAfter description & vbCrLf & vbCrLf
        .Font.Size = 10
        .Font.Color.RGB = RGB(102, 102, 102)
        .Font.Italic = False
        .ParagraphFormat.LineSpacing = LinesToPoints(1.2)
        .Collapse wdCollapseEnd
    End With
End Sub

Sub CreateSkillsSection(rng As Range)
    ' Create skills section with card-like appearance
    
    With rng
        .InsertAfter "SKILLS" & vbCrLf
        .Font.Name = "SF Pro Text"
        .Font.Size = 12
        .Font.Bold = True
        .Font.Color.RGB = RGB(0, 123, 255)
        .ParagraphFormat.SpaceBefore = 12
        .ParagraphFormat.SpaceAfter = 8
        .Collapse wdCollapseEnd
    End With
    
    ' Create a table for organized skill display
    Dim skillTable As Table
    Set skillTable = rng.Tables.Add(rng, 3, 2)
    
    With skillTable
        .Borders.Enable = False
        .Range.Font.Name = "SF Pro Text"
        .Range.Font.Size = 10
        
        ' Row 1
        .Cell(1, 1).Range.Text = "Technical Skills:"
        .Cell(1, 1).Range.Font.Bold = True
        .Cell(1, 1).Range.Font.Color.RGB = RGB(51, 51, 51)
        .Cell(1, 2).Range.Text = "[Skill 1], [Skill 2], [Skill 3], [Programming Language], [Software/Tool]"
        .Cell(1, 2).Range.Font.Color.RGB = RGB(102, 102, 102)
        
        ' Row 2
        .Cell(2, 1).Range.Text = "Industry Knowledge:"
        .Cell(2, 1).Range.Font.Bold = True
        .Cell(2, 1).Range.Font.Color.RGB = RGB(51, 51, 51)
        .Cell(2, 2).Range.Text = "[Domain Knowledge 1], [Industry Practice], [Methodology], [Compliance/Standards]"
        .Cell(2, 2).Range.Font.Color.RGB = RGB(102, 102, 102)
        
        ' Row 3
        .Cell(3, 1).Range.Text = "Soft Skills:"
        .Cell(3, 1).Range.Font.Bold = True
        .Cell(3, 1).Range.Font.Color.RGB = RGB(51, 51, 51)
        .Cell(3, 2).Range.Text = "[Leadership], [Communication], [Problem Solving], [Project Management], [Team Collaboration]"
        .Cell(3, 2).Range.Font.Color.RGB = RGB(102, 102, 102)
        
        .Columns(1).Width = InchesToPoints(1.5)
        .Columns(2).Width = InchesToPoints(4.5)
        .Range.ParagraphFormat.SpaceBefore = 4
        .Range.ParagraphFormat.SpaceAfter = 4
    End With
    
    ' Move cursor after table
    rng.Collapse wdCollapseEnd
    rng.Move wdCharacter, 1
    rng.InsertAfter vbCrLf
End Sub

Sub FormatDocument(doc As Document)
    ' Apply consistent formatting throughout the document
    
    With doc.Range
        .ParagraphFormat.LineSpacing = LinesToPoints(1.15)
        .ParagraphFormat.SpaceAfter = 6
        .Font.Name = "SF Pro Text"
        If .Font.Name <> "SF Pro Text" Then .Font.Name = "Segoe UI"
    End With
    
    ' Adjust header positioning
    If doc.Shapes.Count > 0 Then
        With doc.Shapes(1)
            .Top = InchesToPoints(0.3)
            .Left = InchesToPoints(0.7)
        End With
    End If
    
End Sub