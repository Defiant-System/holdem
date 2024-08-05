<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="table-seats">
	<xsl:for-each select="./*">
		<span class="seat">
			<svg class="outline" viewBox="0 0 95 117">
				<rect x="0" y="0" width="95" height="117" rx="6"/>
			</svg>
			<span class="bg"></span>
			<span class="name"></span>
			<span class="cards"></span>
			<span class="chips"></span>
			<span class="bet"></span>
		</span>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>