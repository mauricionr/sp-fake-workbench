<xsl:template name="FormatUTCDate">
    <xsl:param name="Date"/>

    <xsl:value-of select="ddwrt:FormatDate($Date,1046,7)">
</xsl:template>